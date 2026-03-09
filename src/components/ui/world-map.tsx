"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import DottedMap from "dotted-map";
import RadialPulseLoader from "@/components/ui/loading-animation";

export interface CityPin {
  lat: number;
  lng: number;
  label: string;
  images?: string[];
}

interface MapProps {
  dots?: Array<{
    start: CityPin;
    end: CityPin;
  }>;
  pins?: CityPin[];
  lineColor?: string;
  onPinClick?: (pin: CityPin) => void;
}

const BASE_W = 198;
const BASE_H = 100;
const MIN_W = 30;
const ASPECT = 2;
const LERP_SPEED = 0.12;
const CLICK_THRESHOLD = 5; // pixels — distinguish click from drag

const LOD_CONFIGS = [
  { height: 100, maxW: BASE_W },
  { height: 200, maxW: 120 },
  { height: 350, maxW: 60 },
];

interface VB { x: number; y: number; w: number; h: number }
interface Dot { x: number; y: number }

function extractDots(svgStr: string, scale: number): Dot[] {
  const dots: Dot[] = [];
  const re = /cx="([^"]+)"\s+cy="([^"]+)"/g;
  let m;
  while ((m = re.exec(svgStr)) !== null) {
    dots.push({ x: parseFloat(m[1]) / scale, y: parseFloat(m[2]) / scale });
  }
  return dots;
}

function clampVB(vb: VB): VB {
  const w = Math.max(MIN_W, Math.min(BASE_W, vb.w));
  const h = w / ASPECT;
  const x = Math.max(0, Math.min(BASE_W - w, vb.x));
  const y = Math.max(0, Math.min(BASE_H - h, vb.y));
  return { x, y, w, h };
}

function lerpVB(a: VB, b: VB, t: number): VB {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    w: a.w + (b.w - a.w) * t,
    h: a.h + (b.h - a.h) * t,
  };
}

function vbClose(a: VB, b: VB): boolean {
  return Math.abs(a.x - b.x) < 0.01 && Math.abs(a.y - b.y) < 0.01 && Math.abs(a.w - b.w) < 0.01;
}

export function WorldMap({
  dots = [],
  pins = [],
  lineColor = "#0ea5e9",
  onPinClick,
}: MapProps) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState<VB>({ x: 0, y: 0, w: BASE_W, h: BASE_W / ASPECT });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ sx: number; sy: number; vb: VB } | null>(null);
  const [hoveredPin, setHoveredPin] = useState<number | null>(null);

  const targetVB = useRef<VB>({ x: 0, y: 0, w: BASE_W, h: BASE_W / ASPECT });
  const rafId = useRef(0);
  const currentVB = useRef<VB>({ x: 0, y: 0, w: BASE_W, h: BASE_W / ASPECT });

  useEffect(() => {
    let active = true;
    const tick = () => {
      if (!active) return;
      const target = targetVB.current;
      const cur = currentVB.current;
      if (vbClose(cur, target)) {
        currentVB.current = target;
        setViewBox(target);
        return;
      }
      currentVB.current = lerpVB(cur, target, LERP_SPEED);
      setViewBox(currentVB.current);
      rafId.current = requestAnimationFrame(tick);
    };

    // Start animation loop that checks for changes
    const check = () => {
      if (!active) return;
      if (!vbClose(currentVB.current, targetVB.current)) {
        tick();
      }
      // Poll every 50ms to pick up new targets
      setTimeout(() => check(), 50);
    };
    check();

    return () => { active = false; cancelAnimationFrame(rafId.current); };
  }, [mounted]);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
    const obs = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  // Compute base LOD eagerly (fast, ~8500 dots), defer higher levels
  const baseLod = useMemo(() => {
    const { height, maxW } = LOD_CONFIGS[0];
    const map = new DottedMap({ height, grid: "diagonal" });
    const svg = map.getSVG({ radius: 0.22, color: "#808080", shape: "circle", backgroundColor: "transparent" });
    return { maxW, dots: extractDots(svg, 1), dotR: 0.22, scale: 1 };
  }, []);

  const [lodLevels, setLodLevels] = useState([baseLod]);

  // Defer heavy LOD levels to after first paint
  useEffect(() => {
    const id = requestIdleCallback?.(() => {
      const higher = LOD_CONFIGS.slice(1).map(({ height, maxW }) => {
        const map = new DottedMap({ height, grid: "diagonal" });
        const scale = height / BASE_H;
        const svg = map.getSVG({ radius: 0.22, color: "#808080", shape: "circle", backgroundColor: "transparent" });
        return { maxW, dots: extractDots(svg, scale), dotR: 0.22 / scale, scale };
      });
      setLodLevels([baseLod, ...higher]);
    }) ?? setTimeout(() => {
      const higher = LOD_CONFIGS.slice(1).map(({ height, maxW }) => {
        const map = new DottedMap({ height, grid: "diagonal" });
        const scale = height / BASE_H;
        const svg = map.getSVG({ radius: 0.22, color: "#808080", shape: "circle", backgroundColor: "transparent" });
        return { maxW, dots: extractDots(svg, scale), dotR: 0.22 / scale, scale };
      });
      setLodLevels([baseLod, ...higher]);
    }, 100);
    return () => { if (typeof id === "number") cancelIdleCallback?.(id); };
  }, [baseLod]);

  const baseMap = useMemo(() => new DottedMap({ height: 100, grid: "diagonal" }), []);

  // Collect all unique city pins with their projected positions
  const allCityPins = useMemo(() => {
    const seen = new Map<string, { pin: CityPin; pt: Dot }>();
    const addCity = (c: CityPin) => {
      const key = `${c.lat},${c.lng}`;
      if (!seen.has(key)) {
        const projected = baseMap.getPin({ lat: c.lat, lng: c.lng });
        seen.set(key, { pin: c, pt: { x: projected.x, y: projected.y } });
      }
    };
    dots.forEach((d) => { addCity(d.start); addCity(d.end); });
    pins.forEach(addCity);
    return Array.from(seen.values());
  }, [dots, pins, baseMap]);

  const pinPoints = useMemo(() => allCityPins.map((c) => c.pt), [allCityPins]);

  // Convert screen coords to SVG coords
  const screenToSvg = useCallback((clientX: number, clientY: number): Dot | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const svgPt = pt.matrixTransform(ctm.inverse());
    return { x: svgPt.x, y: svgPt.y };
  }, []);

  // Find nearest pin within hit radius
  const findNearestPin = useCallback((svgPt: Dot): number | null => {
    const hitRadius = viewBox.w * 0.02; // 2% of visible width
    let bestIdx: number | null = null;
    let bestDist = Infinity;
    for (let i = 0; i < pinPoints.length; i++) {
      const dx = pinPoints[i].x - svgPt.x;
      const dy = pinPoints[i].y - svgPt.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < hitRadius && dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }
    return bestIdx;
  }, [pinPoints, viewBox.w]);

  // Wheel zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const prev = targetVB.current;
      if (prev.w >= BASE_W && e.deltaY > 0) return;
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / rect.width;
      const my = (e.clientY - rect.top) / rect.height;
      const f = e.deltaY > 0 ? 1.1 : 0.9;
      const nw = prev.w * f;
      const nh = nw / ASPECT;
      const nx = prev.x + (prev.w - nw) * mx;
      const ny = prev.y + (prev.h - nh) * my;
      targetVB.current = clampVB({ x: nx, y: ny, w: nw, h: nh });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    setReady(true);
    return () => el.removeEventListener("wheel", onWheel);
  }, [mounted]);

  const onDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragRef.current = { sx: e.clientX, sy: e.clientY, vb: targetVB.current };
  }, []);

  const onMove = useCallback((e: React.MouseEvent) => {
    const d = dragRef.current;
    if (!d || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dx = (e.clientX - d.sx) / rect.width * d.vb.w;
    const dy = (e.clientY - d.sy) / rect.height * d.vb.h;
    const clamped = clampVB({ x: d.vb.x - dx, y: d.vb.y - dy, w: d.vb.w, h: d.vb.h });
    targetVB.current = clamped;
    setViewBox(clamped);

    // Check hover on pins
    const svgPt = screenToSvg(e.clientX, e.clientY);
    if (svgPt) setHoveredPin(findNearestPin(svgPt));
  }, [screenToSvg, findNearestPin]);

  const onUp = useCallback((e: React.MouseEvent) => {
    const d = dragRef.current;
    dragRef.current = null;
    setIsDragging(false);

    // If mouse barely moved, treat as click
    if (d && onPinClick) {
      const dx = Math.abs(e.clientX - d.sx);
      const dy = Math.abs(e.clientY - d.sy);
      if (dx < CLICK_THRESHOLD && dy < CLICK_THRESHOLD) {
        const svgPt = screenToSvg(e.clientX, e.clientY);
        if (svgPt) {
          const idx = findNearestPin(svgPt);
          if (idx !== null) {
            onPinClick(allCityPins[idx].pin);
          }
        }
      }
    }
  }, [onPinClick, screenToSvg, findNearestPin, allCityPins]);

  // Hover detection when not dragging
  const onHover = useCallback((e: React.MouseEvent) => {
    if (dragRef.current) return;
    const svgPt = screenToSvg(e.clientX, e.clientY);
    if (svgPt) setHoveredPin(findNearestPin(svgPt));
    else setHoveredPin(null);
  }, [screenToSvg, findNearestPin]);

  // Build SVG string
  const svgContent = useMemo(() => {
    let level = lodLevels[0];
    for (let i = lodLevels.length - 1; i >= 0; i--) {
      if (viewBox.w <= lodLevels[i].maxW) { level = lodLevels[i]; break; }
    }

    const pad = 2;
    const x0 = viewBox.x - pad, y0 = viewBox.y - pad;
    const x1 = viewBox.x + viewBox.w + pad, y1 = viewBox.y + viewBox.h + pad;

    const dotColor = isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)";
    const r = level.dotR;

    let s = "";
    for (const d of level.dots) {
      if (d.x >= x0 && d.x <= x1 && d.y >= y0 && d.y <= y1) {
        s += `<circle cx="${d.x}" cy="${d.y}" r="${r}" fill="${dotColor}"/>`;
      }
    }

    const zr = viewBox.w / BASE_W;
    const pr = 0.5 * Math.max(0.4, Math.sqrt(zr));
    const pulse = 2 * Math.max(0.4, Math.sqrt(zr));
    const hitR = pr * 3; // larger invisible hit target

    for (let i = 0; i < pinPoints.length; i++) {
      const p = pinPoints[i];
      const isHovered = hoveredPin === i;
      const color = isHovered ? "#38bdf8" : lineColor; // brighter on hover
      const scale = isHovered ? 1.4 : 1;
      const sr = pr * scale;

      // Invisible hit target (larger, clickable area)
      s += `<circle cx="${p.x}" cy="${p.y}" r="${hitR}" fill="transparent" style="cursor:pointer" data-pin="${i}"/>`;
      // Visible dot
      s += `<circle cx="${p.x}" cy="${p.y}" r="${sr}" fill="${color}"/>`;
      s += `<circle cx="${p.x}" cy="${p.y}" r="${sr}" fill="${color}" opacity="0.5"><animate attributeName="r" from="${sr}" to="${pulse * scale}" dur="1.5s" repeatCount="indefinite"/><animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite"/></circle>`;
    }

    return s;
  }, [viewBox, lodLevels, pinPoints, lineColor, isDark, hoveredPin]);

  const bg = isDark ? "black" : "white";
  const vbStr = `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`;
  const cursor = isDragging ? "grabbing" : hoveredPin !== null ? "pointer" : "grab";

  return (
    <div className="w-full aspect-[2/1] dark:bg-black bg-white rounded-lg relative font-sans">
      {!ready && (
        <div className="absolute inset-0 z-10 flex items-center justify-center dark:bg-black bg-white rounded-lg">
          <RadialPulseLoader
            size={100}
            color={isDark ? "#667eea" : "#4f46e5"}
            text="Loading map..."
          />
        </div>
      )}
      <div
        ref={containerRef}
        className="h-full w-full [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] select-none"
        style={{ cursor }}
        onMouseDown={onDown}
        onMouseMove={(e) => { onMove(e); onHover(e); }}
        onMouseUp={onUp}
        onMouseLeave={() => { dragRef.current = null; setIsDragging(false); setHoveredPin(null); }}
      >
        <svg
          ref={svgRef}
          viewBox={vbStr}
          style={{ width: "100%", height: "100%", background: bg }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import DottedMap from "dotted-map";

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
  pins?: Array<{ lat: number; lng: number; label?: string }>;
  lineColor?: string;
}

const BASE_W = 198;
const BASE_H = 100;
const MIN_W = 30;
const ASPECT = 2;
const LERP_SPEED = 0.12; // 0-1, higher = snappier

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
}: MapProps) {
  const [isDark, setIsDark] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewBox, setViewBox] = useState<VB>({ x: 0, y: 0, w: BASE_W, h: BASE_W / ASPECT });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ sx: number; sy: number; vb: VB } | null>(null);

  // Smooth zoom: target viewBox that we animate toward
  const targetVB = useRef<VB>({ x: 0, y: 0, w: BASE_W, h: BASE_W / ASPECT });
  const animating = useRef(false);

  const animate = useCallback(() => {
    const current = targetVB.current;
    setViewBox((prev) => {
      if (vbClose(prev, current)) {
        animating.current = false;
        return current; // snap to exact target
      }
      requestAnimationFrame(animate);
      return lerpVB(prev, current, LERP_SPEED);
    });
  }, []);

  const startAnimation = useCallback(() => {
    if (!animating.current) {
      animating.current = true;
      requestAnimationFrame(animate);
    }
  }, [animate]);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const obs = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const lodLevels = useMemo(() => {
    return LOD_CONFIGS.map(({ height, maxW }) => {
      const map = new DottedMap({ height, grid: "diagonal" });
      const scale = height / BASE_H;
      const svg = map.getSVG({
        radius: 0.22,
        color: "#808080",
        shape: "circle",
        backgroundColor: "transparent",
      });
      return { maxW, dots: extractDots(svg, scale), dotR: 0.22 / scale, scale };
    });
  }, []);

  const baseMap = useMemo(() => new DottedMap({ height: 100, grid: "diagonal" }), []);

  const pinPoints = useMemo(() => {
    const pts: Dot[] = [];
    dots.forEach((d) => {
      const s = baseMap.getPin({ lat: d.start.lat, lng: d.start.lng });
      const e = baseMap.getPin({ lat: d.end.lat, lng: d.end.lng });
      pts.push({ x: s.x, y: s.y }, { x: e.x, y: e.y });
    });
    pins.forEach((p) => {
      const pt = baseMap.getPin({ lat: p.lat, lng: p.lng });
      pts.push({ x: pt.x, y: pt.y });
    });
    return pts;
  }, [dots, pins, baseMap]);

  // Wheel zoom — updates target, animation loop does the rest
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const prev = targetVB.current;
      if (prev.w >= BASE_W && e.deltaY > 0) return; // allow page scroll
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
      startAnimation();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [startAnimation]);

  // Drag — direct (no animation needed, should feel immediate)
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
  }, []);

  const onUp = useCallback(() => { dragRef.current = null; setIsDragging(false); }, []);

  // Build SVG string for current LOD + viewport
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
    for (const p of pinPoints) {
      s += `<circle cx="${p.x}" cy="${p.y}" r="${pr}" fill="${lineColor}"/>`;
      s += `<circle cx="${p.x}" cy="${p.y}" r="${pr}" fill="${lineColor}" opacity="0.5"><animate attributeName="r" from="${pr}" to="${pulse}" dur="1.5s" repeatCount="indefinite"/><animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite"/></circle>`;
    }

    return s;
  }, [viewBox, lodLevels, pinPoints, lineColor, isDark]);

  const bg = isDark ? "black" : "white";
  const vbStr = `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`;

  return (
    <div className="w-full aspect-[2/1] dark:bg-black bg-white rounded-lg relative font-sans">
      <div
        ref={containerRef}
        className="h-full w-full [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] select-none"
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={onUp}
      >
        <svg
          viewBox={vbStr}
          style={{ width: "100%", height: "100%", background: bg }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      </div>
    </div>
  );
}

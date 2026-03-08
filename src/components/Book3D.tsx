"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { Book } from "@/lib/books";
import { bookThickness } from "@/lib/books";

interface Book3DProps {
  book: Book;
}

// Page-edge texture: visible horizontal lines with shadow/depth shading
function createPageEdgeTexture(lineCount = 60): THREE.CanvasTexture {
  const W = 512;
  const H = 512;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#f0ebe0";
  ctx.fillRect(0, 0, W, H);

  const spacing = H / lineCount;

  for (let i = 0; i < lineCount; i++) {
    const y = i * spacing + (Math.random() - 0.5) * 0.6;

    ctx.strokeStyle = `rgba(100, 85, 65, ${0.5 + Math.random() * 0.3})`;
    ctx.lineWidth = 2.0 + Math.random() * 0.8;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();

    ctx.strokeStyle = `rgba(255, 252, 245, ${0.55 + Math.random() * 0.3})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, y + spacing * 0.35);
    ctx.lineTo(W, y + spacing * 0.35);
    ctx.stroke();

    if (Math.random() < 0.08) {
      ctx.strokeStyle = "rgba(70, 55, 40, 0.6)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
  }

  const spineGrad = ctx.createLinearGradient(0, 0, W * 0.25, 0);
  spineGrad.addColorStop(0, "rgba(80, 65, 50, 0.5)");
  spineGrad.addColorStop(1, "rgba(80, 65, 50, 0)");
  ctx.fillStyle = spineGrad;
  ctx.fillRect(0, 0, W * 0.25, H);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function createPageEdgeNormalMap(lineCount = 60): THREE.CanvasTexture {
  const W = 512;
  const H = 512;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "rgb(128, 128, 255)";
  ctx.fillRect(0, 0, W, H);

  const spacing = H / lineCount;

  for (let i = 0; i < lineCount; i++) {
    const y = i * spacing;

    ctx.strokeStyle = "rgb(128, 40, 255)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();

    ctx.strokeStyle = "rgb(128, 210, 255)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, y + spacing * 0.5);
    ctx.lineTo(W, y + spacing * 0.5);
    ctx.stroke();
  }

  return new THREE.CanvasTexture(canvas);
}

function createSpineTexture(
  color: string,
  textColor: string,
  title: string
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 128, 512);

  ctx.save();
  ctx.translate(74, 480);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = textColor;
  ctx.font = "bold 28px system-ui, sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText(title, 16, 0, 440);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Subtle paper/cloth texture overlay for cover surfaces
function createCoverBumpMap(): THREE.CanvasTexture {
  const S = 256;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "rgb(128, 128, 128)";
  ctx.fillRect(0, 0, S, S);

  // Random pockmarks / cloth weave dots
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * S;
    const y = Math.random() * S;
    const r = 0.5 + Math.random() * 1.2;
    const v = 108 + Math.floor(Math.random() * 40); // 108–148 range around neutral 128
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// Book dimensions
const COVER_W = 3;
const COVER_H = 4.2;
const COVER_OVERHANG = 0.08;
const COVER_T = 0.04; // cover board thickness
const HINGE_OFFSET = 0.15; // distance from spine edge to hinge groove

export default function Book3D({ book }: Book3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const lastInteraction = useRef(0);
  const currentTime = useRef(0);
  const scaleProgress = useRef(0);

  const thickness = bookThickness(book.pages);
  const pageBlockDepth = thickness - COVER_T * 2;

  const coverTexture = useTexture(book.coverImage);

  const spineTexture = useMemo(
    () => createSpineTexture(book.spineColor, book.textColor, book.title),
    [book.spineColor, book.textColor, book.title]
  );

  const { pageEdgeMap, pageEdgeNormal } = useMemo(
    () => ({
      pageEdgeMap: createPageEdgeTexture(),
      pageEdgeNormal: createPageEdgeNormalMap(),
    }),
    []
  );

  // Fore-edge: rotate texture 90° so lines appear vertical
  const foreEdgeMap = useMemo(() => {
    const tex = pageEdgeMap.clone();
    tex.rotation = Math.PI / 2;
    tex.center.set(0.5, 0.5);
    tex.needsUpdate = true;
    return tex;
  }, [pageEdgeMap]);

  const foreEdgeNormal = useMemo(() => {
    const tex = pageEdgeNormal.clone();
    tex.rotation = Math.PI / 2;
    tex.center.set(0.5, 0.5);
    tex.needsUpdate = true;
    return tex;
  }, [pageEdgeNormal]);

  const foreEdgeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: foreEdgeMap,
        normalMap: foreEdgeNormal,
        normalScale: new THREE.Vector2(0.8, 0.8),
        roughness: 0.9,
        metalness: 0.0,
      }),
    [foreEdgeMap, foreEdgeNormal]
  );

  const topBottomMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: pageEdgeMap,
        normalMap: pageEdgeNormal,
        normalScale: new THREE.Vector2(1.2, 1.2),
        roughness: 0.9,
        metalness: 0.0,
      }),
    [pageEdgeMap, pageEdgeNormal]
  );

  const coverBump = useMemo(() => createCoverBumpMap(), []);

  const coverMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: book.spineColor,
        roughness: 0.7,
        bumpMap: coverBump,
        bumpScale: 0.015,
      }),
    [book.spineColor, coverBump]
  );

  const pageCreamMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#f0ebe0", roughness: 0.9 }),
    []
  );

  // Hinge groove shadow material
  const hingeMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    []
  );

  // Front/back covers are narrower to avoid overlapping with spine
  const boardW = COVER_W - COVER_T;

  // Cover materials
  const frontCoverMats = useMemo(
    () => [
      coverMat, // +X fore-edge lip
      coverMat, // -X (butts against spine, no overlap)
      coverMat, // +Y top lip
      coverMat, // -Y bottom lip
      new THREE.MeshStandardMaterial({ map: coverTexture, roughness: 0.85, metalness: 0, bumpMap: coverBump, bumpScale: 0.008 }), // +Z front
      coverMat, // -Z inside
    ],
    [coverMat, coverTexture]
  );

  const backCoverMats = useMemo(
    () => [coverMat, coverMat, coverMat, coverMat, coverMat, coverMat],
    [coverMat]
  );

  const spineMats = useMemo(
    () => [
      coverMat, // +X (faces page block)
      new THREE.MeshStandardMaterial({ map: spineTexture, roughness: 0.7, bumpMap: coverBump, bumpScale: 0.015 }), // -X visible spine
      coverMat, // +Y
      coverMat, // -Y
      coverMat, // +Z
      coverMat, // -Z
    ],
    [coverMat, spineTexture]
  );

  // Page block
  const pageBlockW = COVER_W - COVER_OVERHANG;
  const pageBlockH = COVER_H - COVER_OVERHANG * 2;

  const pageBlockMaterials = useMemo(
    () => [
      foreEdgeMaterial,  // +X fore-edge (vertical lines)
      pageCreamMat,      // -X against spine
      topBottomMaterial, // +Y top edge
      topBottomMaterial, // -Y bottom edge
      pageCreamMat,      // +Z against front cover
      pageCreamMat,      // -Z against back cover
    ],
    [foreEdgeMaterial, topBottomMaterial, pageCreamMat]
  );

  // Positions — covers shifted right by COVER_T/2 so they butt against spine without overlapping
  const boardX = COVER_T / 2;
  const frontZ = (thickness - COVER_T) / 2;
  const backZ = -(thickness - COVER_T) / 2;
  const spineX = -COVER_W / 2 + COVER_T / 2;

  // Hinge groove position: on the cover surface, near the spine edge
  const hingeX = -COVER_W / 2 + COVER_T + HINGE_OFFSET;

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    currentTime.current = time;

    scaleProgress.current = Math.min(1, scaleProgress.current + 0.035);
    const s = easeOutBack(scaleProgress.current);
    groupRef.current.scale.setScalar(s);

    groupRef.current.position.y = Math.sin(time * 1.5) * 0.05;

    if (time - lastInteraction.current > 3 && !dragging) {
      groupRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = "grab";
      }}
      onPointerOut={() => {
        setHovered(false);
        if (!dragging) document.body.style.cursor = "auto";
      }}
      onPointerDown={() => {
        setDragging(true);
        document.body.style.cursor = "grabbing";
      }}
      onPointerUp={() => {
        setDragging(false);
        lastInteraction.current = currentTime.current;
        document.body.style.cursor = hovered ? "grab" : "auto";
      }}
    >
      {/* Front cover board (narrower, shifted right to avoid spine overlap) */}
      <mesh material={frontCoverMats} position={[boardX, 0, frontZ]}>
        <boxGeometry args={[boardW, COVER_H, COVER_T]} />
      </mesh>

      {/* Back cover board */}
      <mesh material={backCoverMats} position={[boardX, 0, backZ]}>
        <boxGeometry args={[boardW, COVER_H, COVER_T]} />
      </mesh>

      {/* Spine strip */}
      <mesh material={spineMats} position={[spineX, 0, 0]}>
        <boxGeometry args={[COVER_T, COVER_H, thickness]} />
      </mesh>

      {/* Hinge groove — front cover */}
      <mesh
        material={hingeMat}
        position={[hingeX, 0, frontZ + COVER_T / 2 + 0.001]}
      >
        <planeGeometry args={[0.04, COVER_H]} />
      </mesh>

      {/* Hinge groove — back cover */}
      <mesh
        material={hingeMat}
        position={[hingeX, 0, backZ - COVER_T / 2 - 0.001]}
        rotation={[0, Math.PI, 0]}
      >
        <planeGeometry args={[0.04, COVER_H]} />
      </mesh>

      {/* Page block */}
      <mesh
        material={pageBlockMaterials}
        position={[COVER_OVERHANG / 2, 0, 0]}
      >
        <boxGeometry args={[pageBlockW, pageBlockH, pageBlockDepth]} />
      </mesh>

      {/* Headband — top of spine */}
      <mesh position={[spineX + COVER_T / 2 + 0.01, COVER_H / 2 - COVER_OVERHANG - 0.015, 0]}>
        <boxGeometry args={[COVER_T + 0.02, 0.03, pageBlockDepth * 0.3]} />
        <meshStandardMaterial color={book.headbandColor ?? "#c25545"} roughness={0.6} />
      </mesh>

      {/* Tailband — bottom of spine */}
      <mesh position={[spineX + COVER_T / 2 + 0.01, -COVER_H / 2 + COVER_OVERHANG + 0.015, 0]}>
        <boxGeometry args={[COVER_T + 0.02, 0.03, pageBlockDepth * 0.3]} />
        <meshStandardMaterial color={book.headbandColor ?? "#c25545"} roughness={0.6} />
      </mesh>

      {/* Spine-to-page-block junction shadow — front side */}
      <mesh
        material={hingeMat}
        position={[spineX + COVER_T / 2 + 0.002, 0, pageBlockDepth * 0.25]}
      >
        <planeGeometry args={[0.02, COVER_H]} />
      </mesh>

      {/* Spine-to-page-block junction shadow — back side */}
      <mesh
        material={hingeMat}
        position={[spineX + COVER_T / 2 + 0.002, 0, -pageBlockDepth * 0.25]}
        rotation={[0, Math.PI, 0]}
      >
        <planeGeometry args={[0.02, COVER_H]} />
      </mesh>

      {/* Spine top edge shadow */}
      <mesh
        material={hingeMat}
        position={[spineX, COVER_H / 2 + 0.001, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[COVER_T + 0.01, thickness]} />
      </mesh>

      {/* Spine bottom edge shadow */}
      <mesh
        material={hingeMat}
        position={[spineX, -COVER_H / 2 - 0.001, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[COVER_T + 0.01, thickness]} />
      </mesh>
    </group>
  );
}

function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

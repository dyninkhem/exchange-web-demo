"use client";

import { useEffect, useRef, useState } from "react";
import { HeroEngine } from "@/lib/hero-engine";

export interface HeroGLProps {
  colorWheelUrl?: string;
  glyphSet?: string;
  charSize?: number;
  theme?: number;
  quality?: "low" | "medium" | "high";
  className?: string;
}

export default function HeroGL({
  colorWheelUrl = "/assets/color-wheel.png",
  glyphSet,
  charSize,
  theme = 1,
  quality = "medium",
  className,
}: HeroGLProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<HeroEngine | null>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reducedMotion = motionQuery.matches;

    let detectedQuality = quality;
    if (typeof navigator !== "undefined") {
      const cores = navigator.hardwareConcurrency ?? 4;
      if (cores <= 2) detectedQuality = "low";
    }

    const isMobile = window.innerWidth < 768;
    const defaultCharSize = isMobile ? 12 : 9;

    try {
      const engine = new HeroEngine({
        canvas,
        colorWheelUrl,
        glyphSet,
        charSize: charSize ?? defaultCharSize,
        theme,
        reducedMotion,
        quality: detectedQuality,
      });

      engineRef.current = engine;
      engine.start();

      // Pointer events on window (full-page effect)
      const onPointerMove = (e: PointerEvent) => {
        engine.updatePointer(e.clientX, e.clientY);
      };
      window.addEventListener("pointermove", onPointerMove, { passive: true });

      const handleVisibility = () => {
        if (document.hidden) {
          engine.stop();
        } else {
          engine.start();
        }
      };
      document.addEventListener("visibilitychange", handleVisibility);

      const handleMotionChange = (e: MediaQueryListEvent) => {
        engine.setReducedMotion(e.matches);
      };
      motionQuery.addEventListener("change", handleMotionChange);

      return () => {
        window.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("visibilitychange", handleVisibility);
        motionQuery.removeEventListener("change", handleMotionChange);
        engine.destroy();
        engineRef.current = null;
      };
    } catch {
      setFallback(true);
    }
  }, [colorWheelUrl, glyphSet, charSize, theme, quality]);

  if (fallback) {
    return (
      <div
        className={`hero-fallback ${className ?? ""}`}
        style={{
          position: "absolute",
          inset: 0,
          background: "#f5f5f5",
        }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ position: "absolute", inset: 0 }}
    >
      <canvas
        ref={canvasRef}
        className={className}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          imageRendering: "pixelated",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

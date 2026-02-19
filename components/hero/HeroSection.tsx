"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const HeroGL = dynamic(() => import("./HeroGL"), { ssr: false });

export default function HeroSection() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const glTheme = mounted && resolvedTheme === "dark" ? 0 : 1;

  return (
    <div className="relative pt-32 lg:pt-44 pb-12 lg:pb-24 min-h-[70vh] lg:min-h-[85vh]">
      {/* WebGL Torus ASCII animation — covers full hero */}
      <div className="absolute inset-0 max-lg:hidden">
        <HeroGL theme={glTheme} quality="medium" />
      </div>

      {/* Text content */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-12">
        <div className="lg:max-w-[50%]">
          <h1 className="text-foreground text-balance text-5xl font-semibold lg:text-6xl xl:tracking-tight">
            The <span>crypto infrastructure</span> powering the world's
            leading platforms
          </h1>
          <p className="text-muted-foreground mt-4 mb-6 text-balance text-lg lg:text-xl max-w-lg max-lg:mx-auto">
            Regulated crypto trading, custody, and transfers — integrated into
            your product through a single API.
          </p>
          <div className="flex gap-3 max-lg:justify-center">
            <Button
              asChild
              className="[--color-primary:var(--color-indigo-500)]"
            >
              <Link href="#contact">Talk to Sales</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="#docs">View Documentation</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

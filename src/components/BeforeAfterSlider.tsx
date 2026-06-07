/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Sliders, RefreshCw, Eye } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeDate: string;
  afterDate: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeDate,
  afterDate,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0 - 100)
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.current) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    const handleMoveGlobal = (e: MouseEvent) => handleMouseMove(e);
    const handleTouchMoveGlobal = (e: TouchEvent) => handleTouchMove(e);
    const handleUpGlobal = () => handleMouseUp();

    window.addEventListener("mousemove", handleMoveGlobal);
    window.addEventListener("mouseup", handleUpGlobal);
    window.addEventListener("touchmove", handleTouchMoveGlobal);
    window.addEventListener("touchend", handleUpGlobal);

    return () => {
      window.removeEventListener("mousemove", handleMoveGlobal);
      window.removeEventListener("mouseup", handleUpGlobal);
      window.removeEventListener("touchmove", handleTouchMoveGlobal);
      window.removeEventListener("touchend", handleUpGlobal);
    };
  }, []);

  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDragging.current = true;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    handleMove(clientX);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Interactive Slider Comparison
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-gray-500 dark:text-gray-400">
          <span className="bg-gray-200 dark:bg-gray-800 px-2.5 py-1 rounded-md">
            Before: {beforeDate}
          </span>
          <span className="text-gray-400">vs</span>
          <span className="bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-md">
            After: {afterDate}
          </span>
        </div>
      </div>

      <div
        id="slider-container"
        ref={containerRef}
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden select-none cursor-ew-resize border border-gray-200 dark:border-gray-800 shadow-xl"
      >
        {/* After Image (Full width background) */}
        <img
          src={afterImage}
          alt="After Workout"
          className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
          referrerPolicy="no-referrer"
        />
        <div className="absolute right-4 bottom-4 bg-emerald-500/95 text-white font-mono text-xs tracking-wider uppercase font-semibold px-3 py-1.5 rounded-lg shadow-lg z-10 backdrop-blur-sm">
          After (Current)
        </div>

        {/* Before Image (Clipping container width controlled by sliderPosition) */}
        <div
          className="absolute top-0 left-0 h-full overflow-hidden border-r border-white/80 z-10"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImage}
            alt="Before Workout"
            className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
            style={{ width: containerRef.current?.getBoundingClientRect().width }}
            referrerPolicy="no-referrer"
          />
          <div className="absolute left-4 bottom-4 bg-gray-900/95 text-white font-mono text-xs tracking-wider uppercase font-semibold px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-sm">
            Before
          </div>
        </div>

        {/* Floating Split Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 flex items-center justify-center p-0.5"
          style={{ left: `${sliderPosition}%` }}
          onMouseDown={startDrag}
          onTouchStart={startDrag}
        >
          <div className="absolute w-8 h-8 rounded-full bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-neutral-700 flex items-center justify-center pointer-events-none transform -translate-x-1/2">
            <RefreshCw className="w-4 h-4 text-gray-600 dark:text-emerald-400 animate-spin-slow" />
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-400 flex items-center justify-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-emerald-500" />
          Drag the center line left or right to inspect macro musculature differences.
        </p>
      </div>
    </div>
  );
}

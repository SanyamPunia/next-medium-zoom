"use client";

import { useState, useCallback, useRef } from 'react';

interface UseZoomOptions {
  maxZoom?: number;
  minZoom?: number;
}

export const useZoom = ({
  maxZoom = 2,
  minZoom = 1,
}: UseZoomOptions = {}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = useCallback(() => {
    setScale(maxZoom);
    setIsZoomed(true);
  }, [maxZoom]);

  const handleZoomOut = useCallback(() => {
    setScale(minZoom);
    setIsZoomed(false);
  }, [minZoom]);

  return {
    isZoomed,
    scale,
    containerRef,
    handleZoomIn,
    handleZoomOut,
  };
};
import { useState, useEffect, useCallback, RefObject } from "react";
import { ZoomState, UseZoomProps } from "../types";

export const useZoom = (
  childRef: RefObject<HTMLImageElement>,
  { maxZoomFactor, transitionDuration, enableAnimation }: UseZoomProps
): [ZoomState, () => void] => {
  const [state, setState] = useState<ZoomState>({
    isZoomed: false,
    isAnimating: false,
    zoomedDimensions: { width: 0, height: 0 },
    animationStyles: {},
  });

  const calculateZoomedDimensions = useCallback(() => {
    if (childRef.current && typeof window !== "undefined") {
      const img = childRef.current;
      const aspectRatio = img.naturalWidth / img.naturalHeight || 1;

      const maxWidth = window.innerWidth - 40;
      const maxHeight = window.innerHeight - 40;

      let newWidth = img.width * maxZoomFactor;
      let newHeight = newWidth / aspectRatio;

      if (newWidth > maxWidth) {
        newWidth = maxWidth;
        newHeight = newWidth / aspectRatio;
      }

      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = newHeight * aspectRatio;
      }

      return {
        width: Math.round(Math.min(newWidth, maxWidth)),
        height: Math.round(Math.min(newHeight, maxHeight)),
      };
    }
    return { width: 0, height: 0 };
  }, [childRef, maxZoomFactor]);

  useEffect(() => {
    const handleResize = () => {
      if (state.isZoomed) {
        const newDimensions = calculateZoomedDimensions();
        setState((prev) => ({
          ...prev,
          zoomedDimensions: newDimensions,
          animationStyles: {
            ...prev.animationStyles,
            width: `${newDimensions.width}px`,
            height: `${newDimensions.height}px`,
          },
        }));
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calculateZoomedDimensions, state.isZoomed]);

  const toggleZoom = useCallback(() => {
    const img = childRef.current;
    if (!img) return;

    const rect = img.getBoundingClientRect();
    const newDimensions = calculateZoomedDimensions();

    setState((prev) => ({
      isZoomed: !prev.isZoomed,
      isAnimating: true,
      zoomedDimensions: newDimensions,
      animationStyles: {
        position: "fixed",
        top: prev.isZoomed ? `${rect.top}px` : "50%",
        left: prev.isZoomed ? `${rect.left}px` : "50%",
        width: prev.isZoomed ? `${rect.width}px` : `${newDimensions.width}px`,
        height: prev.isZoomed
          ? `${rect.height}px`
          : `${newDimensions.height}px`,
        transform: prev.isZoomed ? "none" : "translate(-50%, -50%)",
        transition: enableAnimation
          ? `all ${transitionDuration}ms ease-in-out`
          : "none",
        zIndex: 9999,
      },
    }));

    setTimeout(
      () => {
        setState((prev) => ({
          ...prev,
          isAnimating: false,
          animationStyles: {
            ...prev.animationStyles,
            top: prev.isZoomed ? "50%" : `${rect.top}px`,
            left: prev.isZoomed ? "50%" : `${rect.left}px`,
            width: prev.isZoomed
              ? `${newDimensions.width}px`
              : `${rect.width}px`,
            height: prev.isZoomed
              ? `${newDimensions.height}px`
              : `${rect.height}px`,
            transform: prev.isZoomed ? "translate(-50%, -50%)" : "none",
          },
        }));
      },
      enableAnimation ? transitionDuration : 0
    );
  }, [
    childRef,
    enableAnimation,
    transitionDuration,
    calculateZoomedDimensions,
  ]);

  return [state, toggleZoom];
};

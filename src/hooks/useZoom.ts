import { useState, useEffect, useCallback, RefObject } from 'react';

interface ZoomState {
  isZoomed: boolean;
  zoomedDimensions: { width: number; height: number };
  animationStyles: React.CSSProperties;
}

interface UseZoomProps {
  maxZoomFactor: number;
  transitionDuration: number;
}

export const useZoom = (
  childRef: RefObject<HTMLImageElement>,
  { maxZoomFactor, transitionDuration }: UseZoomProps
): [ZoomState, () => void] => {
  const [state, setState] = useState<ZoomState>({
    isZoomed: false,
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
        setState(prev => ({
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

    setState(prev => ({
      isZoomed: !prev.isZoomed,
      zoomedDimensions: newDimensions,
      animationStyles: !prev.isZoomed
        ? {
            position: 'fixed',
            top: '50%',
            left: '50%',
            width: `${newDimensions.width}px`,
            height: `${newDimensions.height}px`,
            transform: 'translate(-50%, -50%)',
            transition: `all ${transitionDuration}ms ease-in-out`,
            zIndex: 9999,
          }
        : {
            position: 'fixed',
            top: `${rect.top}px`,
            left: `${rect.left}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            transform: 'none',
            transition: `all ${transitionDuration}ms ease-in-out`,
            zIndex: 9999,
          },
    }));
  }, [childRef, transitionDuration, calculateZoomedDimensions]);

  return [state, toggleZoom];
};
import { useState, useEffect, useCallback, RefObject } from 'react';
import { ZoomState, UseZoomProps } from '../types';

export const useZoom = (
  childRef: RefObject<HTMLImageElement>,
  { maxZoomFactor, transitionDuration, enableAnimation }: UseZoomProps
): [ZoomState, () => void, () => void] => {
  const [state, setState] = useState<ZoomState>({
    isZoomed: false,
    isClosing: false,
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

      setState(prev => ({
        ...prev,
        zoomedDimensions: {
          width: Math.round(Math.min(newWidth, maxWidth)),
          height: Math.round(Math.min(newHeight, maxHeight)),
        },
      }));

      if (state.isZoomed) {
        setState(prev => ({
          ...prev,
          animationStyles: {
            ...prev.animationStyles,
            width: `${Math.round(Math.min(newWidth, maxWidth))}px`,
            height: `${Math.round(Math.min(newHeight, maxHeight))}px`,
          },
        }));
      }
    }
  }, [childRef, maxZoomFactor, state.isZoomed]);

  useEffect(() => {
    calculateZoomedDimensions();
    window.addEventListener("resize", calculateZoomedDimensions);
    return () => window.removeEventListener("resize", calculateZoomedDimensions);
  }, [calculateZoomedDimensions]);

  const toggleZoom = useCallback(() => {
    if (!state.isZoomed) {
      const img = childRef.current;
      if (img) {
        const rect = img.getBoundingClientRect();
        setState(prev => ({
          ...prev,
          isZoomed: true,
          animationStyles: {
            position: 'fixed',
            top: `${rect.top}px`,
            left: `${rect.left}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            transition: enableAnimation ? `all ${transitionDuration}ms ease-in-out` : 'none',
            zIndex: 9999,
          },
        }));
        setTimeout(() => {
          setState(prev => ({
            ...prev,
            animationStyles: {
              ...prev.animationStyles,
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%)`,
              width: `${prev.zoomedDimensions.width}px`,
              height: `${prev.zoomedDimensions.height}px`,
              maxWidth: 'calc(100vw - 40px)',
              maxHeight: 'calc(100vh - 40px)',
            },
          }));
        }, enableAnimation ? 50 : 0);
      }
    } else {
      closeZoom();
    }
  }, [childRef, enableAnimation, transitionDuration, state.isZoomed]);

  const closeZoom = useCallback(() => {
    setState(prev => ({ ...prev, isClosing: true }));
    const img = childRef.current;
    if (img) {
      const rect = img.getBoundingClientRect();
      setState(prev => ({
        ...prev,
        animationStyles: {
          ...prev.animationStyles,
          top: `${rect.top}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          transform: 'none',
          maxWidth: 'none',
          maxHeight: 'none',
        },
      }));
    }
    setTimeout(() => {
      setState(prev => ({ ...prev, isZoomed: false, isClosing: false }));
    }, enableAnimation ? transitionDuration : 0);
  }, [childRef, enableAnimation, transitionDuration]);

  return [state, toggleZoom, closeZoom];
};
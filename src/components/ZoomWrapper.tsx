"use client";

import React, { ReactElement, cloneElement, useState } from "react";
import { useZoom } from "../hooks/useZoom";

interface ZoomWrapperProps {
  children: ReactElement;
  zoomFactor?: number;
  bgColor?: string;
  overlayOpacity?: number;
  enableAnimation?: boolean;
}

export const ZoomWrapper: React.FC<ZoomWrapperProps> = ({
  children,
  zoomFactor = 2,
  bgColor = "black",
  overlayOpacity = 0.75,
  enableAnimation = true,
}) => {
  const { isZoomed, scale, containerRef, handleZoomIn, handleZoomOut } =
    useZoom({
      maxZoom: zoomFactor,
    });
  const [isAnimating, setIsAnimating] = useState(false);

  const handleImageClick = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      if (isZoomed) {
        handleZoomOut();
      } else {
        handleZoomIn();
      }
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isZoomed && e.target === e.currentTarget) {
      handleImageClick();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden cursor-zoom-in"
      style={{ width: "fit-content", height: "fit-content" }}
      onClick={handleImageClick}
    >
      {cloneElement(children, { style: { maxWidth: "100%", height: "auto" } })}
      <div
        className={`fixed inset-0 flex items-center justify-center ${
          isZoomed ? "cursor-zoom-out" : "pointer-events-none"
        }`}
        style={{
          backgroundColor: `rgba(${parseInt(
            bgColor.slice(1, 3),
            16
          )}, ${parseInt(bgColor.slice(3, 5), 16)}, ${parseInt(
            bgColor.slice(5, 7),
            16
          )}, ${isZoomed ? overlayOpacity : 0})`,
          transition: enableAnimation
            ? "background-color 0.3s ease-in-out"
            : "none",
        }}
        onClick={handleOutsideClick}
      >
        <div
          className="relative"
          style={{
            transform: `scale(${isZoomed ? scale : 1})`,
            opacity: isZoomed ? 1 : 0,
            pointerEvents: isZoomed ? "auto" : "none",
            transformOrigin: "center center",
            transition: enableAnimation ? "all 0.3s ease-in-out" : "none",
          }}
        >
          {cloneElement(children, {
            style: {
              maxWidth: "90vw",
              maxHeight: "90vh",
              objectFit: "contain",
              transition: enableAnimation ? "all 0.3s ease-in-out" : "none",
            },
          })}
        </div>
      </div>
    </div>
  );
};
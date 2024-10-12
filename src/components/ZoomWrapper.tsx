"use client";

import React, { useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useZoom } from "../hooks/useZoom";

interface ZoomWrapperProps {
  children: React.ReactElement;
  maxZoomFactor?: number;
  transitionDuration?: number;
  backgroundColor?: string;
}

export const ZoomWrapper: React.FC<ZoomWrapperProps> = ({
  children,
  maxZoomFactor = 1.5,
  transitionDuration = 300,
  backgroundColor = "rgba(0, 0, 0, 0.75)",
}) => {
  const childRef = useRef<HTMLImageElement>(null);
  const [{ isZoomed, zoomedDimensions, animationStyles }, toggleZoom] = useZoom(childRef, {
    maxZoomFactor,
    transitionDuration,
  });

  const child = React.Children.only(children);
  const childElement = React.cloneElement(child, {
    onClick: toggleZoom,
    className: `cursor-zoom-in ${child.props.className || ""}`,
    ref: childRef,
  });

  return (
    <>
      {childElement}
      {isZoomed &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 flex justify-center items-center z-50"
            style={{ backgroundColor }}
            onClick={toggleZoom}
          >
            <div style={animationStyles}>
              <Image
                src={child.props.src}
                alt={child.props.alt}
                width={zoomedDimensions.width}
                height={zoomedDimensions.height}
                style={{
                  objectFit: "contain",
                  width: "100%",
                  height: "100%",
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
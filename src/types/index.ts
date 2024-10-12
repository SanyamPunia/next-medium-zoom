import { ReactElement } from "react";

export interface ZoomWrapperProps {
  children: ReactElement;
  zoomFactor?: number;
  bgColor?: string;
  overlayOpacity?: number;
  enableAnimation?: boolean;
}

export interface UseZoomOptions {
  maxZoom?: number;
  minZoom?: number;
}

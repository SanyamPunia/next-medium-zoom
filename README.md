## next-medium-zoom

A React component for zooming Next.js Image components with smooth animations and customizable options.

![nmz](https://github.com/user-attachments/assets/3fbd8ca5-cda9-4117-ba70-031ba7ea1afe)

### Installation

```bash
npm install next-medium-zoom
```

### Usage

```ts
import { ZoomWrapper } from "next-medium-zoom";
import Image from "next/image";

export default function YourComponent() {
  return (
    <ZoomWrapper
      maxZoomFactor={1.5}
      transitionDuration={300}
      enableAnimation={true}
      backgroundColor="#000000cc"
      zoomedImageClassName="rounded-lg"
    >
      <Image
        src="/your-image.jpg"
        alt="Your image description"
        width={500}
        height={300}
      />
    </ZoomWrapper>
  );
}
```

### Props

| Prop                   | Type         | Default               | Description                                        |
| ---------------------- | ------------ | --------------------- | -------------------------------------------------- |
| `children`             | ReactElement | (required)            | The Next.js Image component to be wrapped          |
| `maxZoomFactor`        | number       | 1.5                   | The maximum zoom factor for the image              |
| `transitionDuration`   | number       | 300                   | The duration of the zoom animation in milliseconds |
| `enableAnimation`      | boolean      | true                  | Whether to enable the zoom animation               |
| `backgroundColor`      | string       | "rgba(0, 0, 0, 0.75)" | The background color of the zoom overlay           |
| `zoomedImageClassName` | string       | ""                    | Optional class for styling the zoomed-in image     |

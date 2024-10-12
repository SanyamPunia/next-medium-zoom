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
      zoomFactor={1.5}
      bgColor="#000000"
      overlayOpacity={0.8}
      enableAnimation={true}
    >
      <Image
        src="/image.png"
        alt="image alt text"
        width={400}
        height={300}
        className="z-50"
      />
    </ZoomWrapper>
  );
}
```

### Props

| Prop              | Type           | Default        | Description                                                                                     |
| ----------------- | -------------- | -------------- | ----------------------------------------------------------------------------------------------- |
| `children`        | `ReactElement` | **(required)** | The **Next.js Image** component or any element to be wrapped inside the zoom functionality.     |
| `zoomFactor`      | `number`       | `2`            | The factor by which the image should zoom in when clicked.                                      |
| `bgColor`         | `string`       | `"black"`      | The background color of the overlay when the image is zoomed in, in any valid CSS color format. |
| `overlayOpacity`  | `number`       | `0.75`         | Opacity level of the background overlay when zoomed in.                                         |
| `enableAnimation` | `boolean`      | `true`         | Whether to animate the zoom effect when transitioning in and out.                               |

### TODOs

- Add animation variant options as props
- Custom wrapper class extension
- Optimize implementation

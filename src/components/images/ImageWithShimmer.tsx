import Image, { ImageProps } from 'next/image';
import { FC } from 'react';

type ImageWithShimmerProps = Omit<ImageProps, 'src'> & {
  src: ImageProps['src'] | null | undefined;
};

const ImageWithShimmer: FC<ImageWithShimmerProps> = ({ className, src, width, height, alt, ...props }) => {
  if (!src) {
    const w = width ?? 200;
    const h = height ?? 200;
    return (
      <Image
        className={className}
        src={`data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`}
        alt={'Empty image'}
        width={w}
        height={h}
      />
    );
  }

  return <Image className={className} src={src} alt={alt ?? ''} width={width} height={height} {...props} />;
};

export default ImageWithShimmer;

/**
 * @see https://image-component.nextjs.gallery/shimmer
 */
const shimmer = (w: SafeNumber, h: SafeNumber) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str);

type SafeNumber = number | `${number}`;

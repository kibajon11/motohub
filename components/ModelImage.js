'use client';

import Image from "next/image";
import { useState } from "react";

/** Обертка над <Image/>: если файла нет — показывает /placeholder.png */
export default function ModelImage({ src, alt, ...rest }) {
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc("/placeholder.png")}
    />
  );
}

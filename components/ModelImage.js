'use client';

import Image from "next/image";
import React from "react";

export default function ModelImage({ src, alt = "", className = "", ...props }) {
  const [error, setError] = React.useState(false);
  const finalSrc = error ? "/placeholder.png" : (src || "/placeholder.png");

  return (
    <Image
      src={finalSrc}
      alt={alt}
      onError={() => setError(true)}
      className={className}
      {...props}
    />
  );
}

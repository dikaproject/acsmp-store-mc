import { useEffect, useState } from "react";

/**
 * <img> that walks a list of URLs on error (skin API down, unknown player…).
 * When every source fails it renders `fallback` instead of a broken image.
 */
const SkinImage = ({ sources, alt, className = "", fallback = null, ...props }) => {
  const [index, setIndex] = useState(0);
  const key = sources.join("|");

  // New player/sources: start the chain over
  useEffect(() => setIndex(0), [key]);

  if (index >= sources.length) return fallback;

  return (
    <img
      src={sources[index]}
      alt={alt}
      loading="lazy"
      decoding="async"
      draggable={false}
      referrerPolicy="no-referrer"
      onError={() => setIndex((i) => i + 1)}
      className={className}
      {...props}
    />
  );
};

export default SkinImage;

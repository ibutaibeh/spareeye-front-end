import { useEffect, useMemo } from "react";
import { toAbs } from "../../Helpers/AddRequestHelpers";

const Thumbs = ({ files = [], urls = [], size = 72, rounded = "rounded-md"}) => {
  const fileThumbs = useMemo(
    () =>
      (files || []).map((f) => ({
        src: URL.createObjectURL(f),
        alt: f.name || "image",
      })),
    [files]
  );
  
  useEffect(() => {
    return () => {
      (files || []).forEach((f) => {
        try {
          URL.revokeObjectURL(f.__preview || "");
        } catch { }
      });
    };
  }, [files]);

  const urlThumbs = (urls || []).map((u, i) => ({ src: toAbs(u), alt: `image-${i}` }));
  const all = [...fileThumbs, ...urlThumbs];
  if (!all.length) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {all.map((t, idx) => (
        <a
          key={t.src + idx}
          href={t.src}
          target="_blank"
          rel="noopener noreferrer"
          className={`block overflow-hidden border border-gray-200 bg-white ${rounded}`}
          title="Open image"
          style={{ width: size, height: size }}
        >
          <img
            src={t.src}
            alt={t.alt}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => e.currentTarget.remove()}
          />
        </a>
      ))}
    </div>
  );
}

export default Thumbs
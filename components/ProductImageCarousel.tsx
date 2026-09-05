"use client";

import { useState } from "react";

function estUneVideo(url: string): boolean {
  return /\.(mp4|webm|mov)(\?.*)?$/i.test(url);
}

export default function ProductImageCarousel({
  images,
  nom,
}: {
  images: string[];
  nom: string;
}) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="h-72 md:h-96 bg-paper rounded-lg flex items-center justify-center">
        <span className="text-ink-900/30 text-sm">Photo à venir</span>
      </div>
    );
  }

  const media = images[index];
  const isVideo = estUneVideo(media);

  return (
    <div>
      <div className="relative h-72 md:h-96 bg-paper rounded-lg overflow-hidden">
        {isVideo ? (
          <video
            src={media}
            controls
            className="w-full h-full object-contain bg-black"
          >
            Ta vidéo n&apos;est pas prise en charge par ton navigateur.
          </video>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={media} alt={`${nom} - photo ${index + 1}`} className="w-full h-full object-cover" />
        )}

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Média précédent"
              onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Média suivant"
              onClick={() => setIndex((i) => (i + 1) % images.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center"
            >
              ›
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-2">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={estUneVideo(img) ? `Voir la vidéo ${i + 1}` : `Voir la photo ${i + 1}`}
              className={`relative w-14 h-14 rounded-md overflow-hidden border-2 ${
                i === index ? "border-ink-950" : "border-transparent"
              }`}
            >
              {estUneVideo(img) ? (
                <span className="w-full h-full flex items-center justify-center bg-ink-950 text-white text-lg">
                  ▶
                </span>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img} alt="" className="w-full h-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

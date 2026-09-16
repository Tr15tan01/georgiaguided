"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { MediaRef } from "@/lib/types";

export function Gallery({ images, title }: { images: MediaRef[]; title: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);

  const open = (i: number, el: HTMLButtonElement) => {
    lastTrigger.current = el;
    setIndex(i);
    dialogRef.current?.showModal();
  };
  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);
  const step = useCallback((dir: 1 | -1) => setIndex((i) => (i == null ? i : (i + dir + images.length) % images.length)), [images.length]);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onClose = () => {
      setIndex(null);
      lastTrigger.current?.focus();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    d.addEventListener("close", onClose);
    d.addEventListener("keydown", onKey);
    return () => {
      d.removeEventListener("close", onClose);
      d.removeEventListener("keydown", onKey);
    };
  }, [step]);

  if (!images.length) return null;
  const current = index != null ? images[index] : null;

  return (
    <>
      <ul className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
        {images.map((img, i) => (
          <li key={`${img.url}-${i}`} className={i === 0 ? "col-span-2 row-span-2" : ""}>
            <button
              type="button"
              onClick={(e) => open(i, e.currentTarget)}
              className="group relative block aspect-square w-full overflow-hidden rounded-sm bg-line"
              aria-label={`Open image ${i + 1} of ${images.length}${img.alt ? `: ${img.alt}` : ""}`}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes={i === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
                unoptimized={img.url.endsWith(".svg")}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>
      <dialog
        ref={dialogRef}
        aria-label={`${title} gallery`}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-black/95 p-0 text-white backdrop:bg-black/80"
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        {current && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between p-4">
              <p className="text-sm text-white/70" aria-live="polite">{(index ?? 0) + 1} / {images.length}</p>
              <button type="button" onClick={close} className="inline-flex size-11 items-center justify-center rounded-full hover:bg-white/10" aria-label="Close gallery">
                <X />
              </button>
            </div>
            <figure className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col px-4">
              <div className="relative flex-1">
                <Image key={current.url} src={current.url} alt={current.alt} fill sizes="100vw" quality={85} unoptimized={current.url.endsWith(".svg")} className="object-contain hero-rise" />
              </div>
              {(current.caption || current.alt) && <figcaption className="py-4 text-center text-sm text-white/75">{current.caption || current.alt}</figcaption>}
            </figure>
            {images.length > 1 && (
              <div className="flex justify-center gap-3 pb-6">
                <button type="button" onClick={() => step(-1)} className="inline-flex size-12 items-center justify-center rounded-full border border-white/30 hover:bg-white/10" aria-label="Previous image"><ChevronLeft /></button>
                <button type="button" onClick={() => step(1)} className="inline-flex size-12 items-center justify-center rounded-full border border-white/30 hover:bg-white/10" aria-label="Next image"><ChevronRight /></button>
              </div>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}

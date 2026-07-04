"use client";

import { useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { useTranslations } from "next-intl";

export interface DropzoneImage {
  dataUrl: string;
  filename?: string;
}

const MAX_IMAGES = 3;

export function ImageDropzone({
  images,
  onChange,
  onError,
}: {
  images: DropzoneImage[];
  onChange: (images: DropzoneImage[]) => void;
  onError: (message: string) => void;
}) {
  const t = useTranslations("input");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  async function addFiles(files: FileList | File[]) {
    const incoming = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (incoming.length === 0) return;

    if (images.length + incoming.length > MAX_IMAGES) {
      onError(t("errorTooManyImages"));
      return;
    }

    try {
      const compressed = await Promise.all(
        incoming.map(async (file) => {
          const resized = await imageCompression(file, {
            maxSizeMB: 1.5,
            maxWidthOrHeight: 2000,
            useWebWorker: true,
          });
          const dataUrl = await imageCompression.getDataUrlFromFile(resized);
          return { dataUrl, filename: file.name };
        }),
      );
      onChange([...images, ...compressed]);
    } catch {
      onError(t("errorTooLarge"));
    }
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[var(--neutral-900)]">{t("imageLabel")}</label>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") inputRef.current?.click();
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          void addFiles(event.dataTransfer.files);
        }}
        onPaste={(event) => {
          const files = Array.from(event.clipboardData.items)
            .filter((item) => item.kind === "file")
            .map((item) => item.getAsFile())
            .filter((file): file is File => file !== null);
          if (files.length > 0) void addFiles(files);
        }}
        className={`flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 text-center text-sm transition-colors ${
          isDragging
            ? "border-[var(--neutral-400)] bg-[var(--neutral-50)]"
            : "border-[var(--neutral-200)] hover:border-[var(--neutral-300)]"
        }`}
      >
        <span className="text-[var(--neutral-500)]">{t("imageHint")}</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          className="hidden"
          onChange={(event) => {
            if (event.target.files) void addFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>

      {images.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-3">
          {images.map((image, index) => (
            <li key={image.dataUrl} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.dataUrl}
                alt={image.filename ?? ""}
                className="h-20 w-20 rounded-lg object-cover"
              />
              <button
                type="button"
                aria-label={t("imageRemove")}
                onClick={() => removeImage(index)}
                className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--neutral-950)] text-sm text-[var(--eggshell)]"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

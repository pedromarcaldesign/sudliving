import path from "node:path";
import fs from "node:fs";
import Image from "@11ty/eleventy-img";

export const SRC = "src";

// Converte "/images/foto.jpg" (caminho usado pelo Pages CMS) no ficheiro em src/images
const resolveSrc = (src) => {
  if (!src) return null;
  const clean = src.replace(/^\//, "");
  const file = path.join(SRC, clean);
  return fs.existsSync(file) ? file : null;
};

const IMG_OPTS = {
  formats: ["avif", "webp", "jpeg"],
  outputDir: "_site/img/",
  urlPath: "/img/",
  sharpAvifOptions: { quality: 46, effort: 5 },
  sharpWebpOptions: { quality: 72 },
  sharpJpegOptions: { quality: 76, progressive: true, mozjpeg: true },
  filenameFormat: (id, src, width, format) => `${path.parse(src).name}-${id}-${width}.${format}`,
};

export async function picture(src, alt = "", sizes = "100vw", widths = [480, 800, 1200, 1600], opts = {}) {
  const file = resolveSrc(src);
  if (!file) return "";
  const metadata = await Image(file, { ...IMG_OPTS, widths });
  const loading = opts.eager ? "eager" : "lazy";
  return Image.generateHTML(metadata, {
    alt,
    sizes,
    loading,
    decoding: opts.eager ? "sync" : "async",
    ...(opts.eager ? { fetchpriority: "high" } : opts.low ? { fetchpriority: "low" } : {}),
    ...(opts.class ? { class: opts.class } : {}),
  });
}

// URL de uma versão JPEG (para Open Graph / dados estruturados)
export async function imageUrl(src, width = 1200) {
  const file = resolveSrc(src);
  if (!file) return "";
  const metadata = await Image(file, { ...IMG_OPTS, widths: [width], formats: ["jpeg"] });
  return metadata.jpeg[0].url;
}


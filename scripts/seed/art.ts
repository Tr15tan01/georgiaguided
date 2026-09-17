/**
 * Generates original, lightweight SVG landscape artwork used as placeholder imagery.
 * Replace with real photography via Admin → Media before launch.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

type Palette = { sky: [string, string]; far: string; mid: string; near: string; sun: string; accent: string };

const P: Record<string, Palette> = {
  dawn: { sky: ["#e7e9cf", "#8fae7f"], far: "#7d9a72", mid: "#4a6b4c", near: "#1f3326", sun: "#fbfae6", accent: "#eef3dd" },
  alpine: { sky: ["#dfe9e0", "#8fb0a2"], far: "#a8c0ae", mid: "#5c7d6b", near: "#273b30", sun: "#ffffff", accent: "#ffffff" },
  wine: { sky: ["#eaeecb", "#9bb06a"], far: "#93a86f", mid: "#4f6b3a", near: "#22331d", sun: "#f7f7d9", accent: "#cbd889" },
  dusk: { sky: ["#20302a", "#3f6a4d"], far: "#2f4a39", mid: "#22362a", near: "#101a13", sun: "#bfe0c6", accent: "#9ccfae" },
  forest: { sky: ["#e4ead9", "#9fb18e"], far: "#8ea084", mid: "#4f6147", near: "#243021", sun: "#fbf6e4", accent: "#dfe7c8" },
  sea: { sky: ["#e9f0dd", "#6fa693"], far: "#8fbba9", mid: "#3f7a66", near: "#1d3a30", sun: "#f6fbe9", accent: "#dff0e2" },
  stone: { sky: ["#ecefdc", "#a8b487"], far: "#aebb92", mid: "#76855c", near: "#3b4630", sun: "#fbfdec", accent: "#e8eecf" },
};

function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

function ridge(r: () => number, base: number, amp: number, peaks: number, w: number, h: number, sharp = false) {
  const pts: string[] = [`M0 ${h}`, `L0 ${base}`];
  const step = w / peaks;
  for (let i = 0; i <= peaks; i++) {
    const x = i * step;
    const y = base - r() * amp;
    if (sharp) pts.push(`L${x.toFixed(0)} ${y.toFixed(0)}`);
    else pts.push(`Q${(x - step / 2).toFixed(0)} ${(y - r() * amp * 0.4).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)}`);
  }
  pts.push(`L${w} ${h}Z`);
  return pts.join(" ");
}

const W = 1600;
const H = 1000;

type Motif = "peaks" | "church" | "vineyard" | "towers" | "oldtown" | "sea" | "caves" | "monastery" | "table" | "road" | "forest" | "fortress";

export function artwork(name: string, palette: keyof typeof P, motif: Motif, seed: number): string {
  const p = P[palette];
  const r = rng(seed);
  const layers: string[] = [];
  const sunX = 300 + r() * 1000;
  layers.push(`<circle cx="${sunX.toFixed(0)}" cy="${(220 + r() * 120).toFixed(0)}" r="${(60 + r() * 40).toFixed(0)}" fill="${p.sun}" opacity=".85"/>`);
  const sharp = ["peaks", "church", "towers", "monastery", "road"].includes(motif);
  layers.push(`<path d="${ridge(r, 560, 330, 9, W, H, sharp)}" fill="${p.far}"/>`);
  if (sharp) {
    // snow caps on the tallest far peaks
    layers.push(`<path d="${ridge(r, 470, 200, 7, W, H, true)}" fill="${p.accent}" opacity=".35"/>`);
  }
  layers.push(`<path d="${ridge(r, 700, 200, 7, W, H, sharp)}" fill="${p.mid}"/>`);

  const near = (extra: string) => layers.push(extra);
  switch (motif) {
    case "church": {
      const x = 1030, y = 610;
      near(`<g fill="${p.near}"><path d="M${x} ${y} h110 v-70 h-110z"/><path d="M${x + 30} ${y - 70} h50 v-50 h-50z"/><path d="M${x + 25} ${y - 120} l30 -45 l30 45z"/><path d="M${x - 40} ${y} h60 v-40 h-60z"/><path d="M${x - 45} ${y - 40} l35 -25 l35 25z"/></g>`);
      break;
    }
    case "towers":
      for (let i = 0; i < 6; i++) {
        const x = 380 + i * 150 + r() * 40, top = 470 + r() * 90;
        near(`<g fill="${p.near}"><rect x="${x}" y="${top}" width="42" height="${800 - top}"/><path d="M${x - 4} ${top} h50 l-6 -18 h-38z"/><rect x="${x + 16}" y="${top + 20}" width="9" height="14" fill="${p.accent}" opacity=".6"/></g>`);
      }
      near(`<path d="M0 1000 V800 Q400 740 800 770 T1600 760 V1000Z" fill="${p.near}"/>`);
      break;
    case "vineyard":
      for (let i = 0; i < 16; i++) {
        const y = 760 + i * 16;
        near(`<path d="M0 ${y} Q800 ${y - 60 + i * 3} 1600 ${y - 10}" stroke="${p.near}" stroke-width="${3 + i * 0.6}" fill="none" stroke-dasharray="${6 + i} ${4 + i / 2}" opacity=".9"/>`);
      }
      break;
    case "oldtown":
      for (let i = 0; i < 22; i++) {
        const x = i * 75 + r() * 20, h = 90 + r() * 120, y = 830 - h;
        near(`<g fill="${p.near}"><rect x="${x}" y="${y}" width="68" height="${h + 200}"/><rect x="${x + 6}" y="${y + 18}" width="56" height="10" fill="${p.accent}" opacity=".25"/>${r() > 0.7 ? `<path d="M${x + 20} ${y} l14 -40 l14 40z"/>` : ""}</g>`);
      }
      near(`<path d="M150 560 l40 -60 l40 60 v240 h-80z" fill="${p.near}"/>`);
      break;
    case "sea":
      near(`<rect y="760" width="${W}" height="240" fill="${p.near}" opacity=".85"/>`);
      for (let i = 0; i < 10; i++) near(`<path d="M${r() * 1400} ${790 + i * 20} h${80 + r() * 160}" stroke="${p.accent}" stroke-width="2" opacity=".35"/>`);
      for (let i = 0; i < 9; i++) {
        const x = 900 + i * 70, h = 120 + r() * 200;
        near(`<rect x="${x}" y="${760 - h}" width="50" height="${h}" fill="${p.mid}" opacity=".9"/>`);
      }
      break;
    case "caves":
      near(`<path d="M0 1000 V520 Q800 440 1600 540 V1000Z" fill="${p.near}"/>`);
      for (let row = 0; row < 4; row++) for (let i = 0; i < 12; i++) {
        if (r() > 0.6) continue;
        near(`<path d="M${150 + i * 110 + r() * 30} ${620 + row * 80} q14 -30 28 0 v18 h-28z" fill="${p.sky[0]}" opacity=".5"/>`);
      }
      break;
    case "monastery":
      near(`<path d="M0 1000 V760 Q400 700 800 740 T1600 720 V1000Z" fill="${p.near}"/>`);
      near(`<g fill="${p.near}"><rect x="700" y="600" width="200" height="140"/><rect x="765" y="540" width="70" height="60"/><path d="M760 540 l40 -50 l40 50z"/><path d="M800 490 v-26 M790 474 h20" stroke="${p.near}" stroke-width="5"/></g>`);
      break;
    case "table":
      near(`<rect y="720" width="${W}" height="280" fill="${p.near}"/>`);
      for (let i = 0; i < 7; i++) {
        const cx = 200 + i * 200;
        near(`<ellipse cx="${cx}" cy="${800 + (i % 2) * 60}" rx="80" ry="24" fill="${p.accent}" opacity=".75"/>`);
        if (i % 3 === 1) near(`<path d="M${cx + 90} ${700 + (i % 2) * 60} h22 l-4 70 h-14z" fill="${p.mid}"/>`);
      }
      break;
    case "road":
      near(`<path d="${ridge(r, 860, 90, 6, W, H)}" fill="${p.near}"/>`);
      near(`<path d="M560 1000 C 700 880, 900 860, 1000 760 S 1250 690 1400 700" stroke="${p.accent}" stroke-width="10" fill="none" opacity=".55"/>`);
      break;
    case "forest":
      for (let i = 0; i < 40; i++) {
        const x = r() * W, y = 700 + r() * 250, s = 40 + r() * 60;
        near(`<path d="M${x} ${y - s * 2} l${s / 2} ${s * 2} h-${s}z" fill="${p.near}"/>`);
      }
      break;
    case "fortress":
      near(`<path d="M0 1000 V780 Q500 720 900 690 T1600 760 V1000Z" fill="${p.near}"/>`);
      near(`<path d="M820 690 v-120 h20 v-20 h20 v20 h20 v-20 h20 v20 h20 v120z M1000 690 v-80 h14 v-14 h14 v14 h14 v80z" fill="${p.near}"/>`);
      break;
    default:
      near(`<path d="${ridge(r, 860, 140, 6, W, H, true)}" fill="${p.near}"/>`);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${name}">
<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sky[0]}"/><stop offset="1" stop-color="${p.sky[1]}"/></linearGradient>
<linearGradient id="haze" x1="0" y1="0" x2="0" y2="1"><stop offset=".45" stop-color="${p.sky[1]}" stop-opacity="0"/><stop offset="1" stop-color="${p.near}" stop-opacity=".35"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="url(#s)"/>
${layers.join("\n")}
<rect width="${W}" height="${H}" fill="url(#haze)"/>
</svg>`;
}

export interface SeedImage { file: string; alt: string; palette: keyof typeof P; motif: Motif }

export const IMAGES: Record<string, SeedImage> = {
  heroHome: { file: "caucasus-dawn.svg", alt: "Illustration of Caucasus peaks at dawn with a hilltop church", palette: "dawn", motif: "church" },
  kazbegi: { file: "kazbegi.svg", alt: "Illustration of a stone church beneath snow-capped Mount Kazbek", palette: "alpine", motif: "church" },
  tbilisi: { file: "tbilisi.svg", alt: "Illustration of Tbilisi Old Town rooftops at dusk", palette: "dusk", motif: "oldtown" },
  kakheti: { file: "kakheti.svg", alt: "Illustration of vineyard rows in the Alazani Valley", palette: "wine", motif: "vineyard" },
  svaneti: { file: "svaneti.svg", alt: "Illustration of Svan defensive towers below high mountains", palette: "alpine", motif: "towers" },
  mtskheta: { file: "mtskheta.svg", alt: "Illustration of a hilltop monastery above a river confluence", palette: "stone", motif: "monastery" },
  kutaisi: { file: "kutaisi.svg", alt: "Illustration of a cliffside cave city in golden light", palette: "stone", motif: "caves" },
  borjomi: { file: "borjomi.svg", alt: "Illustration of forested hills around a spa valley", palette: "forest", motif: "forest" },
  batumi: { file: "batumi.svg", alt: "Illustration of the Black Sea coast with a modern skyline", palette: "sea", motif: "sea" },
  food: { file: "supra.svg", alt: "Illustration of a Georgian supra table with shared dishes and wine", palette: "wine", motif: "table" },
  road: { file: "mountain-road.svg", alt: "Illustration of a mountain road winding through the Caucasus", palette: "dawn", motif: "road" },
  fortress: { file: "fortress.svg", alt: "Illustration of fortress walls on a ridge", palette: "dusk", motif: "fortress" },
  highlands: { file: "highlands.svg", alt: "Illustration of layered mountain ridges in soft light", palette: "alpine", motif: "peaks" },
  service: { file: "journey.svg", alt: "Illustration of rolling hills and a distant road", palette: "forest", motif: "road" },
};

export function writeArtwork(outDir: string) {
  mkdirSync(outDir, { recursive: true });
  Object.entries(IMAGES).forEach(([, img], i) => {
    writeFileSync(path.join(outDir, img.file), artwork(img.alt, img.palette, img.motif, 1000 + i * 7919));
  });
}

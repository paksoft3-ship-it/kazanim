/**
 * Generates local SVG placeholder imagery for Kazanım Gayrimenkul.
 *
 * These stand in for real project photography so the site builds and renders
 * with no external image dependencies. Every image field remains editable from
 * the admin panel, so real photos replace these without code changes.
 *
 * Run: node scripts/generate-placeholders.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.join(process.cwd(), "public", "images");

// Kazanım brand palette
const NAVY = "#061824";
const CORPORATE = "#0B5145";
const GOLD = "#C7A45B";
const CYAN = "#C7A45B"; // window glow — champagne gold, no cyan in the Kazanım system
const IVORY = "#F7F2E8";

/** Deterministic pseudo-random from a string seed, so output is stable. */
function seeded(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * An architectural blueprint-style placeholder: navy gradient, a skyline of
 * building silhouettes, a fine grid, and a gold label.
 */
function buildingSvg({ width, height, label, seed, tone = "navy" }) {
  const rand = seeded(seed);
  const dark = tone === "navy";
  const bgFrom = dark ? NAVY : IVORY;
  const bgTo = dark ? CORPORATE : "#E7E2D8";
  const strokeColor = dark ? "rgba(255,255,255,0.07)" : "rgba(6,24,36,0.06)";
  const buildingFill = dark ? "rgba(255,255,255,0.06)" : "rgba(6,24,36,0.08)";
  const buildingStroke = dark ? "rgba(199,164,91,0.35)" : "rgba(6,24,36,0.18)";
  const labelColor = dark ? GOLD : CORPORATE;

  // Skyline
  const buildings = [];
  const count = Math.max(5, Math.round(width / 150));
  let x = -20;
  while (x < width + 20) {
    const w = 40 + rand() * (width / count);
    const h = height * (0.25 + rand() * 0.5);
    const y = height - h;
    buildings.push(`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="${buildingFill}" stroke="${buildingStroke}" stroke-width="1"/>`);

    // Window grid
    const cols = Math.max(1, Math.floor(w / 22));
    const rows = Math.max(1, Math.floor(h / 26));
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        if (rand() > 0.55) continue;
        const wx = x + 8 + c * 22;
        const wy = y + 12 + r * 26;
        if (wx + 8 > x + w - 4 || wy + 10 > height - 4) continue;
        buildings.push(`<rect x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="8" height="10" fill="${dark ? CYAN : CORPORATE}" opacity="${(0.12 + rand() * 0.3).toFixed(2)}"/>`);
      }
    }
    x += w + 8 + rand() * 18;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(label)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bgFrom}"/>
      <stop offset="100%" stop-color="${bgTo}"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0 L0 0 0 40" fill="none" stroke="${strokeColor}" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect width="${width}" height="${height}" fill="url(#grid)"/>
  ${buildings.join("\n  ")}
  <rect x="0" y="${height - 3}" width="${width}" height="3" fill="${GOLD}" opacity="0.55"/>
  <text x="${width / 2}" y="${height / 2}" text-anchor="middle" dominant-baseline="middle"
        font-family="Georgia, 'Playfair Display', serif" font-size="${Math.max(14, Math.round(width / 26))}"
        fill="${labelColor}" opacity="0.85" letter-spacing="1.5">${escapeXml(label)}</text>
</svg>`;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const FILES = [
  // Heroes (wide)
  ["hero/anasayfa-hero.svg", 1920, 1080, "KAZANIM GAYRİMENKUL", "navy"],
  ["hero/kurumsal-hero.svg", 1920, 720, "KURUMSAL", "navy"],
  ["hero/projeler-hero.svg", 1920, 720, "PROJELERİMİZ", "navy"],
  ["hero/galeri-hero.svg", 1920, 720, "GALERİ", "navy"],
  ["hero/haberler-hero.svg", 1920, 720, "HABERLER", "navy"],
  ["hero/kariyer-hero.svg", 1920, 720, "İNSAN KAYNAKLARI", "navy"],
  ["hero/iletisim-hero.svg", 1920, 720, "İLETİŞİM", "navy"],
  ["hero/legal-hero.svg", 1920, 560, "YASAL BİLGİLENDİRME", "ivory"],

  // Project covers (demo projects)
  ["projects/kazanim-vadi.svg", 1200, 900, "Kazanım Vadi", "navy"],
  ["projects/kazanim-bosphorus.svg", 1200, 900, "Kazanım Bosphorus", "navy"],
  ["projects/kazanim-cadde.svg", 1200, 900, "Kazanım Cadde", "navy"],
  ["projects/kazanim-residence.svg", 1200, 900, "Kazanım Residence", "navy"],
  ["projects/kazanim-is-merkezi.svg", 1200, 900, "Kazanım İş Merkezi", "navy"],
  ["projects/kazanim-yasam-evleri.svg", 1200, 900, "Kazanım Yaşam Evleri", "navy"],
  ["projects/proje-placeholder.svg", 1200, 900, "Kazanım Gayrimenkul", "navy"],

  // Corporate / about
  ["corporate/hakkimizda.svg", 1000, 1250, "Kurumsal Yaklaşımımız", "navy"],
  ["corporate/tarihce.svg", 1200, 800, "Tarihçemiz", "ivory"],
  ["corporate/kalite.svg", 1200, 800, "Kalite Anlayışımız", "ivory"],

  // News covers (demo articles)
  ["news/dogru-lokasyon.svg", 1200, 675, "Yatırım Rehberi", "navy"],
  ["news/proje-guncelleme.svg", 1200, 675, "Proje Gelişmesi", "navy"],
  ["news/deger-odakli-projeler.svg", 1200, 675, "Piyasa Analizi", "ivory"],
  ["news/teslim-duyurusu.svg", 1200, 675, "Teslim Duyurusu", "navy"],
  ["news/haber-placeholder.svg", 1200, 675, "Kazanım Gayrimenkul", "ivory"],

  // Open Graph
  ["og/kazanim-og.svg", 1200, 630, "KAZANIM GAYRİMENKUL", "navy"],
];

// Gallery tiles across the categories used by the filter tabs.
const GALLERY = [
  ["dis-cephe", "Dış Cephe", 3],
  ["ic-mekan", "İç Mekân", 3],
  ["sosyal-alanlar", "Sosyal Alanlar", 2],
  ["santiye", "Şantiye", 3],
  ["kat-planlari", "Kat Planları", 2],
];

for (const [slug, label, count] of GALLERY) {
  for (let i = 1; i <= count; i++) {
    FILES.push([
      `gallery/${slug}-${String(i).padStart(2, "0")}.svg`,
      900,
      900,
      `${label} ${i}`,
      slug === "kat-planlari" ? "ivory" : "navy",
    ]);
  }
}

const written = [];
for (const [relPath, width, height, label, tone] of FILES) {
  const full = path.join(ROOT, relPath);
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, buildingSvg({ width, height, label, seed: relPath, tone }), "utf8");
  written.push(relPath);
}

console.log(`Generated ${written.length} placeholder images under public/images/`);

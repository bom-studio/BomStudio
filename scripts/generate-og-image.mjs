import { writeFileSync, unlinkSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const outPath = resolve(root, "public/og-image.png");
const logoPath = resolve(root, "public/images/brand/logo-b.png");
const portfolioPath = resolve(root, "public/images/portfolio/steakhouse.webp");

const WIDTH = 1200;
const HEIGHT = 630;
const BRAND = "#0F766E";
const INK = "#111111";
const MUTED = "#737373";

async function main() {
  // Hero-focused crop of steakhouse longshot
  const desktopScreen = await sharp(portfolioPath)
    .extract({ left: 0, top: 0, width: 1920, height: 860 })
    .resize(620, 388, { fit: "cover", position: "top" })
    .png()
    .toBuffer();

  const mobileScreen = await sharp(portfolioPath)
    .extract({ left: 420, top: 0, width: 1080, height: 1920 })
    .resize(136, 240, { fit: "cover", position: "top" })
    .png()
    .toBuffer();

  const laptop = await buildLaptop(desktopScreen);
  const phone = await buildPhone(mobileScreen);

  const laptopShadow = await softShadow(680, 430, 22);
  const phoneShadow = await softShadow(176, 320, 16);

  const logo = await sharp(logoPath)
    .resize({
      width: 36,
      height: 36,
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toBuffer();

  const fontFamily =
    process.platform === "win32"
      ? "'Malgun Gothic', '맑은 고딕', Arial, sans-serif"
      : "'Noto Sans KR', 'Apple SD Gothic Neo', Arial, sans-serif";

  const scene = Buffer.from(`
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wash" x1="1" y1="0.15" x2="0.35" y2="1">
          <stop offset="0%" stop-color="${BRAND}" stop-opacity="0.07"/>
          <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
        </linearGradient>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0F766E" stroke-opacity="0.05" stroke-width="1"/>
        </pattern>
        <radialGradient id="glow" cx="76%" cy="48%" r="38%">
          <stop offset="0%" stop-color="${BRAND}" stop-opacity="0.09"/>
          <stop offset="100%" stop-color="${BRAND}" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <rect width="100%" height="100%" fill="#FFFFFF"/>
      <rect x="480" y="0" width="720" height="630" fill="url(#wash)"/>
      <rect x="480" y="0" width="720" height="630" fill="url(#grid)"/>
      <rect width="100%" height="100%" fill="url(#glow)"/>

      <text x="108" y="72" font-family="${fontFamily}" font-size="17" font-weight="700" fill="${INK}" letter-spacing="1.5">BOM STUDIO</text>

      <text x="64" y="126" font-family="${fontFamily}" font-size="14" font-weight="600" fill="${BRAND}" letter-spacing="0.6">Kimpo Web Development</text>

      <text x="64" y="204" font-family="${fontFamily}" font-size="52" font-weight="800" fill="${INK}" letter-spacing="-1.4">홈페이지 제작</text>

      <text x="64" y="262" font-family="${fontFamily}" font-size="22" font-weight="500" fill="${MUTED}">브랜드를 위한</text>
      <text x="64" y="296" font-family="${fontFamily}" font-size="22" font-weight="500" fill="${MUTED}">맞춤형 홈페이지 제작</text>

      <text x="64" y="362" font-family="${fontFamily}" font-size="24" font-weight="700" fill="${BRAND}">29만원부터</text>

      <text x="64" y="430" font-family="${fontFamily}" font-size="17" font-weight="500" fill="${MUTED}">김포 · 일산 방문상담</text>
      <text x="64" y="460" font-family="${fontFamily}" font-size="17" font-weight="500" fill="${MUTED}">전국 비대면 제작</text>
    </svg>
  `);

  const image = await sharp(scene)
    .composite([
      { input: logo, left: 64, top: 44 },
      { input: laptopShadow, left: 498, top: 88 },
      { input: laptop, left: 518, top: 98 },
      { input: phoneShadow, left: 478, top: 288 },
      { input: phone, left: 492, top: 298 },
    ])
    .png()
    .toBuffer();

  writeFileSync(outPath, image);

  // cleanup temp preview if present
  try {
    unlinkSync(resolve(root, "public/og-preview-crop.jpg"));
  } catch {
    /* ignore */
  }

  console.log(`Created ${outPath} (${image.length} bytes)`);
}

async function buildLaptop(screenPng) {
  const w = 660;
  const h = 420;
  const sx = 20;
  const sy = 16;
  const sw = 620;
  const sh = 388;

  const chrome = Buffer.from(`
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#3F3F46"/>
          <stop offset="100%" stop-color="#18181B"/>
        </linearGradient>
        <linearGradient id="base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#E4E4E7"/>
          <stop offset="100%" stop-color="#A1A1AA"/>
        </linearGradient>
      </defs>
      <rect x="6" y="2" width="648" height="404" rx="16" fill="url(#lid)"/>
      <rect x="${sx - 2}" y="${sy - 2}" width="${sw + 4}" height="${sh + 4}" rx="4" fill="#09090B"/>
      <circle cx="330" cy="8" r="2" fill="#52525B"/>
      <path d="M0 404 H660 L640 416 H20 Z" fill="url(#base)"/>
      <rect x="250" y="405" width="160" height="5" rx="1.5" fill="#71717A"/>
    </svg>
  `);

  return sharp({
    create: {
      width: w,
      height: h,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: await sharp(chrome).png().toBuffer(), left: 0, top: 0 },
      { input: screenPng, left: sx, top: sy },
    ])
    .png()
    .toBuffer();
}

async function buildPhone(screenPng) {
  const w = 156;
  const h = 300;

  const chrome = Buffer.from(`
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#3F3F46"/>
          <stop offset="100%" stop-color="#18181B"/>
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="154" height="298" rx="30" fill="url(#body)"/>
      <rect x="7" y="7" width="142" height="286" rx="24" fill="#09090B"/>
      <rect x="52" y="14" width="52" height="15" rx="8" fill="#000000"/>
    </svg>
  `);

  return sharp({
    create: {
      width: w,
      height: h,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: await sharp(chrome).png().toBuffer(), left: 0, top: 0 },
      { input: screenPng, left: 10, top: 36 },
    ])
    .png()
    .toBuffer();
}

async function softShadow(width, height, blur) {
  const plate = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 15, g: 23, b: 42, alpha: 0.12 },
    },
  })
    .png()
    .toBuffer();

  return sharp(plate).blur(blur).png().toBuffer();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

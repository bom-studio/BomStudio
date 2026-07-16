import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const outPath = resolve(root, "public/og-image.jpg");
const logoPath = resolve(root, "public/images/brand/logo-b.png");

const WIDTH = 1200;
const HEIGHT = 630;
const BRAND = "#0F766E";

async function main() {
  const logo = await sharp(logoPath)
    .resize({ width: 160, height: 168, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer();

  const fontFamily =
    process.platform === "win32"
      ? "'Malgun Gothic', '맑은 고딕', Arial, sans-serif"
      : "'Noto Sans KR', 'Apple SD Gothic Neo', Arial, sans-serif";

  const svg = Buffer.from(`
    <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#FFFFFF"/>
      <rect x="0" y="0" width="12" height="100%" fill="${BRAND}"/>
      <circle cx="1080" cy="80" r="180" fill="${BRAND}" fill-opacity="0.06"/>
      <circle cx="1120" cy="560" r="140" fill="${BRAND}" fill-opacity="0.05"/>
      <text x="220" y="250" font-family="${fontFamily}" font-size="56" font-weight="700" fill="${BRAND}" letter-spacing="4">BOM STUDIO</text>
      <text x="220" y="340" font-family="${fontFamily}" font-size="48" font-weight="700" fill="#111827">김포 홈페이지 제작</text>
      <text x="220" y="410" font-family="${fontFamily}" font-size="28" font-weight="500" fill="#4B5563">반응형 · SEO · 맞춤 제작</text>
      <rect x="220" y="450" width="72" height="4" rx="2" fill="${BRAND}"/>
      <text x="220" y="510" font-family="${fontFamily}" font-size="20" font-weight="500" fill="#6B7280">bomstudio.kr</text>
    </svg>
  `);

  const image = await sharp(svg)
    .composite([{ input: logo, left: 48, top: 190 }])
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer();

  writeFileSync(outPath, image);
  console.log(`Created ${outPath} (${image.length} bytes)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

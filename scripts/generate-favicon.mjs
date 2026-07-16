import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const logoPath = resolve(root, "public/images/brand/logo-b.png");
const appDir = resolve(root, "app");

async function makeSquarePng(size, paddingRatio = 0.12) {
  const pad = Math.round(size * paddingRatio);
  const inner = size - pad * 2;

  const resized = await sharp(logoPath)
    .resize({
      width: inner,
      height: inner,
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: resized, left: pad, top: pad }])
    .png()
    .toBuffer();
}

async function main() {
  const icon32 = await makeSquarePng(32, 0.1);
  const icon48 = await makeSquarePng(48, 0.1);
  const icon180 = await makeSquarePng(180, 0.12);
  const icon512 = await makeSquarePng(512, 0.12);

  // Next.js App Router convention
  writeFileSync(resolve(appDir, "icon.png"), icon512);
  writeFileSync(resolve(appDir, "apple-icon.png"), icon180);

  // Multi-size ICO (PNG-compressed ICO-compatible via sharp to ICO isn't native;
  // write a 32px PNG-based favicon.ico using sharp's png then rename approach:
  // Use 32px PNG bytes packaged - sharp can output ico on some builds.
  // Fallback: write 32x32 as favicon.ico content via png rename isn't ideal.
  // Prefer generating real ico with pngs embedded using a minimal ICO writer.

  const ico = await buildIco([
    { size: 16, buffer: await makeSquarePng(16, 0.08) },
    { size: 32, buffer: icon32 },
    { size: 48, buffer: icon48 },
  ]);
  writeFileSync(resolve(appDir, "favicon.ico"), ico);

  // Public copies for explicit URL / metadata references
  writeFileSync(resolve(root, "public/favicon.ico"), ico);
  writeFileSync(resolve(root, "public/icon.png"), icon512);
  writeFileSync(resolve(root, "public/apple-icon.png"), icon180);
  writeFileSync(resolve(root, "public/apple-touch-icon.png"), icon180);

  console.log("Generated favicon assets in app/ and public/");
}

/** Minimal multi-size ICO builder (PNG entries) */
function buildIco(images) {
  const count = images.length;
  const headerSize = 6 + count * 16;
  const pngBuffers = images.map((img) => img.buffer);

  let offset = headerSize;
  const entries = [];

  for (let i = 0; i < count; i++) {
    const size = images[i].size;
    const png = pngBuffers[i];
    entries.push({
      width: size >= 256 ? 0 : size,
      height: size >= 256 ? 0 : size,
      size: png.length,
      offset,
    });
    offset += png.length;
  }

  const file = Buffer.alloc(offset);
  // ICONDIR
  file.writeUInt16LE(0, 0); // reserved
  file.writeUInt16LE(1, 2); // type = icon
  file.writeUInt16LE(count, 4);

  for (let i = 0; i < count; i++) {
    const entryOffset = 6 + i * 16;
    const e = entries[i];
    file.writeUInt8(e.width, entryOffset);
    file.writeUInt8(e.height, entryOffset + 1);
    file.writeUInt8(0, entryOffset + 2); // color count
    file.writeUInt8(0, entryOffset + 3); // reserved
    file.writeUInt16LE(1, entryOffset + 4); // planes
    file.writeUInt16LE(32, entryOffset + 6); // bit count
    file.writeUInt32LE(e.size, entryOffset + 8);
    file.writeUInt32LE(e.offset, entryOffset + 12);
  }

  for (let i = 0; i < count; i++) {
    pngBuffers[i].copy(file, entries[i].offset);
  }

  return file;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

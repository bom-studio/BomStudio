const img = await fetch("http://localhost:3000/og-image.jpg");
console.log("image", img.status, img.headers.get("content-type"));

const res = await fetch("http://localhost:3000/");
const html = await res.text();

for (const key of [
  "og:title",
  "og:description",
  "og:image",
  "og:url",
  "og:type",
  "og:site_name",
  "twitter:card",
  "twitter:image",
]) {
  console.log(html.includes(key) ? `OK ${key}` : `MISSING ${key}`);
}

const ogImages = [...html.matchAll(/property="og:image" content="([^"]+)"/g)].map((m) => m[1]);
const twImages = [...html.matchAll(/name="twitter:image(?::src)?" content="([^"]+)"/g)].map(
  (m) => m[1]
);

console.log("og:image urls", ogImages);
console.log("twitter:image urls", twImages);

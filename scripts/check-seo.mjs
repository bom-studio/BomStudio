const html = await (await fetch("http://localhost:3000/")).text();
const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
const desc = html.match(/name="description" content="([^"]+)"/)?.[1];
const ogTitle = html.match(/property="og:title" content="([^"]+)"/)?.[1];
const ogDesc = html.match(/property="og:description" content="([^"]+)"/)?.[1];
const twTitle = html.match(/name="twitter:title" content="([^"]+)"/)?.[1];

console.log("title:", title);
console.log("desc:", desc);
console.log("og:title:", ogTitle);
console.log("og:desc:", ogDesc);
console.log("twitter:title:", twTitle);
console.log("h1 service:", html.includes(">김포 홈페이지 제작<"));
console.log("subtitle:", html.includes("소상공인과 기업을 위한 맞춤형 홈페이지 제작 전문"));
console.log("LocalBusiness:", html.includes("LocalBusiness"));
console.log("WebSite:", html.includes('"@type":"WebSite"') || html.includes('"@type": "WebSite"'));
console.log("김포시:", html.includes("김포시"));
console.log("고양시:", html.includes("고양시"));
console.log("인천:", html.includes("인천광역시"));

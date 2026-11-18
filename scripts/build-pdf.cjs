// Renders index.html with the print stylesheet into Patrick-Guettler-Resume.pdf.
// Usage: node scripts/build-pdf.cjs   (needs the `playwright` package and Chromium)
const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const out = path.join(root, "Patrick-Guettler-Resume.pdf");
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".png": "image/png" };

const server = http.createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split("?")[0]).replace(/^\/+/, "") || "index.html";
  const file = path.join(root, rel);
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const { port } = server.address();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.emulateMedia({ media: "print" });
    await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true });
    console.log(`Wrote ${path.relative(root, out)}`);
  } finally {
    await browser.close();
    server.close();
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

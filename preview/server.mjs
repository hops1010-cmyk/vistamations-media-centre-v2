import http from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("./retro-amp/", import.meta.url);
const files = new Map([
  ["/", new URL("index.html", root)],
  ["/amp.css", new URL("amp.css", root)],
  ["/amp.js", new URL("amp.js", root)],
  ["/assets/faceplate.png", new URL("assets/faceplate.png", root)],
  ["/assets/control-layout.json", new URL("assets/control-layout.json", root)],
  [
    "/vendor/gsap.min.js",
    new URL("../node_modules/gsap/dist/gsap.min.js", import.meta.url),
  ],
]);
const mime = {
  html: "text/html",
  css: "text/css",
  js: "text/javascript",
  png: "image/png",
  json: "application/json",
};
const port = Number(process.env.AMP_PREVIEW_PORT || 3216);
http
  .createServer(async (req, res) => {
    const file = files.get(new URL(req.url, "http://localhost").pathname);
    if (!file || !["GET", "HEAD"].includes(req.method)) {
      res.writeHead(404).end();
      return;
    }
    try {
      const data = await readFile(file);
      res.writeHead(200, {
        "Content-Type":
          mime[fileURLToPath(file).split(".").pop()] ||
          "application/octet-stream",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy":
          "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; connect-src 'self'; frame-ancestors 'self'",
      });
      res.end(req.method === "HEAD" ? undefined : data);
    } catch {
      res
        .writeHead(500)
        .end("Preview dependency or asset missing. Run npm install.");
    }
  })
  .listen(port, "127.0.0.1", () =>
    console.log(`Retro amp preview: http://localhost:${port}/`),
  );

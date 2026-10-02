import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const sourcePath = path.join(root, "index.html");
const html = fs.readFileSync(sourcePath, "utf8");

const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (!styleMatch || !scriptMatch) {
  throw new Error("Inline style or script block not found");
}

const logicMarker = "let currentSurgery = null;";
const markerIndex = scriptMatch[1].indexOf(logicMarker);
if (markerIndex < 0) {
  throw new Error("Application logic marker not found");
}

const normalizeDashes = (value) => value.replace(/[\u2013\u2014]/g, "-");
const dist = path.join(root, "dist");
fs.mkdirSync(dist, { recursive: true });

const cleanHtml = normalizeDashes(html
  .replace(/<style>[\s\S]*?<\/style>/, '<link rel="stylesheet" href="styles.css">')
  .replace(/<script>[\s\S]*?<\/script>/, '<script src="data.js"></script>\n<script src="app.js"></script>'));

fs.writeFileSync(path.join(dist, "index.html"), cleanHtml, "utf8");
fs.writeFileSync(path.join(dist, "styles.css"), normalizeDashes(styleMatch[1].trim()) + "\n", "utf8");
fs.writeFileSync(path.join(dist, "data.js"), normalizeDashes(scriptMatch[1].slice(0, markerIndex).trim()) + "\n", "utf8");
fs.writeFileSync(path.join(dist, "app.js"), normalizeDashes(scriptMatch[1].slice(markerIndex).trim()) + "\n", "utf8");


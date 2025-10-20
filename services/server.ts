import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mime from "mime";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const htmlFilePath = path.join(__dirname, "..", "client", "dist");

export const server = http.createServer((req, res) => {
  let filePath = path.join(
    htmlFilePath,
    req.url === "/" ? "index.html" : (req.url as string)
  );

  if (!filePath.startsWith(htmlFilePath)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end("Not Found");
    } else {
      const contentType = mime.getType(filePath) || "application/octet-stream";
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    }
  });
});

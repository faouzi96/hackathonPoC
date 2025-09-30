import { exec } from "child_process";
import { writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicPath = path.join(__dirname, "client", "public", "data.json");

const jsonData = {
  title: "Sample Data",
  nodes: [
    { id: "n1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
    { id: "n2", position: { x: 100, y: 100 }, data: { label: "Node 2" } },
    { id: "n3", position: { x: -100, y: 100 }, data: { label: "Node 3" } },
  ],
  edges: [
    { id: "n1-n2", source: "n1", target: "n2" },
    { id: "n1-n3", source: "n1", target: "n3" },
  ],
};

writeFileSync(publicPath, JSON.stringify(jsonData, null, 2));

exec(
  "npm run dev",
  { cwd: path.join(__dirname, "client") },
  (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Failed to start React app:", err);
      return;
    }
    console.log(stdout);
  }
);

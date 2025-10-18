import { exec } from "child_process";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const source = path.resolve(__dirname, "../client/dist");
const destination = path.resolve(__dirname, "../build/client/dist");
const rootDir = path.resolve(__dirname, "..");
const buildDir = path.resolve(__dirname, "../build");

async function packageApp() {
  try {
    console.log("🚀 Building Node.js app...");
    exec("npm run build", { cwd: path.join(__dirname) }, (err) => {
      if (err) {
        console.error("❌ Failed to start Node.js app:", err);
        return;
      }
    });

    console.log("🚀 Building React app...");
    exec("npm run build", {
      cwd: path.join(__dirname, "client"),
    });

    await fs.copy(source, destination);
    console.log("✅ Orchestrator and client build completed successfully.");

    console.log("🚀 Packing the application...");

    await fs.copy(
      path.join(rootDir, "package.json"),
      path.join(buildDir, "package.json")
    );
    await fs.copy(
      path.join(rootDir, "package-lock.json"),
      path.join(buildDir, "package-lock.json")
    );

    console.log("✅ Application ready to be packaged!.");
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

packageApp();

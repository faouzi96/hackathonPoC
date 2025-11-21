import { exec } from "child_process";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const source = path.resolve(__dirname, "../client/dist");
const destination = path.resolve(__dirname, "../build/client/dist");
const sourceApi = path.resolve(__dirname, "../api/dist");
const destinationApi = path.resolve(__dirname, "../build/api/dist");
const sourceApiPackage = path.resolve(__dirname, "../api");
const destinationApiPackage = path.resolve(__dirname, "../build/api");
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

    console.log("🚀 Building Nest Server...");
    exec("npm run build", {
      cwd: path.join(__dirname, "api"),
    });
    await fs.copy(sourceApi, destinationApi);
    await fs.copy(
      path.join(sourceApiPackage, "package.json"),
      path.join(destinationApiPackage, "package.json")
    );
    await fs.copy(
      path.join(sourceApiPackage, "package-lock.json"),
      path.join(destinationApiPackage, "package-lock.json")
    );
    console.log("🚀 Installing Nest Server dependencies...");
    exec("npm install", {
      cwd: path.join(destinationApiPackage),
    });

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

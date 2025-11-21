import { exec } from "child_process";
import fs from "fs-extra";
import path from "path";

const __dirname = (() => {
  const cwd = process.cwd();
  try {
    if (fs.existsSync(path.join(cwd, "package.json"))) return cwd;
  } catch (e) {
    console.error(e);
  }
  const alt = path.resolve(__dirname, "..");
  try {
    if (fs.existsSync(path.join(alt, "package.json"))) return alt;
  } catch (e) {
    console.error(e);
  }
  process.exit(1);
})();

const source = path.resolve(__dirname, "client/dist");
const destination = path.resolve(__dirname, "build/client/dist");
const sourceApi = path.resolve(__dirname, "api/dist");
const destinationApi = path.resolve(__dirname, "build/api/dist");
const sourceApiPackage = path.resolve(__dirname, "api");
const destinationApiPackage = path.resolve(__dirname, "build/api");
const rootDir = __dirname;
const buildDir = path.resolve(__dirname, "build");

function execAsync(command, options = {}) {
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error) return reject(error);
      resolve({ stdout, stderr });
    });
  });
}

async function packageApp() {
  try {
    console.log("🛠️ Building Node.js app...");
    await execAsync("npm run build", { cwd: __dirname });

    console.log("🛠️ Building Nest Server...");
    await execAsync("npm run build", { cwd: path.join(__dirname, "api") });

    console.log("🛠️ Building React app...");
    await execAsync("npm run build", { cwd: path.join(__dirname, "client") });

    console.log("📦➡️ Moving necessary files...");
    await fs.copy(source, destination);
    await fs.copy(sourceApi, destinationApi);
    await fs.copy(
      path.join(sourceApiPackage, "package.json"),
      path.join(destinationApiPackage, "package.json"),
    );
    await fs.copy(
      path.join(sourceApiPackage, "package-lock.json"),
      path.join(destinationApiPackage, "package-lock.json"),
    );
    console.log("📦 Installing Nest Server dependencies...");
    await execAsync("npm install", { cwd: path.join(destinationApiPackage) });

    console.log("✅ Orchestrator and client build completed successfully.");

    console.log("📦 Packing the application...");

    await fs.copy(
      path.join(rootDir, "package.json"),
      path.join(buildDir, "package.json"),
    );
    await fs.copy(
      path.join(rootDir, "package-lock.json"),
      path.join(buildDir, "package-lock.json"),
    );

    console.log("✅ Application ready to be packaged!");
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

packageApp();

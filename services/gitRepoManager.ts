import { execFile } from "child_process";
import fs from "fs-extra";
import os from "os";
import path from "path";

function execFileAsync(
  file: string,
  args: string[],
  options: { cwd?: string } = {},
) {
  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    execFile(file, args, options, (err, stdout, stderr) => {
      if (err) return reject(err);
      resolve({
        stdout: stdout?.toString() ?? "",
        stderr: stderr?.toString() ?? "",
      });
    });
  });
}

/**
 * Clone a git repository into a temporary `repoTemp` folder.
 * Returns the absolute path to the cloned repository.
 */
export async function cloneRepo(repoUrl: string): Promise<string> {
  if (!repoUrl) throw new Error("The repository Url is required");

  // base temp folder inside OS temp directory (keeps temp across runs separate from repo)
  const baseTmp = path.resolve(os.tmpdir(), "repoTemp");
  await fs.ensureDir(baseTmp);

  // derive a folder name from the repo URL (repo name only)
  // examples:
  // https://github.com/owner/repo.git -> repo
  // git@github.com:owner/repo.git -> repo
  const repoNameMatch = repoUrl.match(/([^/\:]+)\/?(?:\.git)?$/);
  const repoName = (repoNameMatch && repoNameMatch[1]) || `repo`;

  const target = path.join(baseTmp, repoName);

  // Remove existing folder if present to ensure a fresh clone
  if (await fs.pathExists(target)) {
    await fs.remove(target);
  }

  // run git clone <repoUrl> <target>
  await execFileAsync("git", ["clone", repoUrl, target]);

  return baseTmp;
}

/**
 * Delete a previously cloned repository folder.
 */
export async function deleteRepo(repoPath: string): Promise<void> {
  if (!repoPath) throw new Error("repoPath is required");
  await fs.remove(repoPath);
}

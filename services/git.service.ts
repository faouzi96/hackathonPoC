import { execFile } from "child_process";
import fs from "fs-extra";
import os from "os";
import path from "path";

export class GitService {
  public async clone(repoUrl: string): Promise<string> {
    if (!repoUrl) throw new Error("The repository Url is required");

    const baseTmp = path.resolve(os.tmpdir(), "repoTemp");
    await fs.ensureDir(baseTmp);

    const repoNameMatch = repoUrl.match(/([^/\:]+)\/?(?:\.git)?$/);
    const repoName = (repoNameMatch && repoNameMatch[1]) || `repo`;

    const target = path.join(baseTmp, repoName);

    if (await fs.pathExists(target)) {
      await fs.remove(target);
    }

    await this.execFileAsync("git", ["clone", repoUrl, target]);

    return baseTmp;
  }

  public async delete(repoPath: string): Promise<void> {
    if (!repoPath) throw new Error("repoPath is required");
    await fs.remove(repoPath);
  }

  private execFileAsync(
    file: string,
    args: string[],
    options: { cwd?: string } = {}
  ) {
    return new Promise<{ stdout: string; stderr: string }>(
      (resolve, reject) => {
        execFile(file, args, options, (err, stdout, stderr) => {
          if (err) return reject(err);
          resolve({
            stdout: stdout?.toString() ?? "",
            stderr: stderr?.toString() ?? "",
          });
        });
      }
    );
  }
}

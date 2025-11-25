import path from "path";
import { homedir } from "os";
import fs from "fs-extra";
import { LocalStorage } from "node-localstorage";
import { UserInfo } from "../types/app.types.js";

export class StorageService {
  private localStorage: LocalStorage;

  constructor() {
    const storagePath = path.join(homedir(), ".flow-analyzer-creds");
    if (!fs.existsSync(storagePath)) {
      fs.mkdirSync(storagePath, { recursive: true });
    }
    // Use OS temp directory or a custom folder
    this.localStorage = new LocalStorage(storagePath);
  }

  public saveUserInfo(key: UserInfo, value: string): void {
    this.localStorage.setItem(key, value);
  }

  public getUserInfo(key: UserInfo): string {
    return this.localStorage.getItem(key) || "";
  }
}

import type { BrowserWindow } from 'electron';
import fs from 'fs';
import os from 'os';
import osUtils from 'os-utils';
import { SystemUtilities } from './SystemUtilities.js';

export class ResourceManager {
  private static readonly POLLING_INTERVAL = 500;

  public static pollResources(mainWindow: BrowserWindow): void {
    setInterval(async () => {
      const cpuUsage = await ResourceManager.getCPUUsage();
      const ramUsage = ResourceManager.getRAMUsage();
      const storageData = ResourceManager.getStorageData();
      SystemUtilities.ipcWebContentsSend(IPC_EVENTS.STATISTICS, mainWindow.webContents, {
        cpuUsage,
        ramUsage,
        storageUsage: storageData.usage,
      });
    }, ResourceManager.POLLING_INTERVAL);
  }

  public static getStaticData() {
    return {
      cpuModel: os.cpus()[0].model,
      totalStorage: ResourceManager.getStorageData().total,
      totalMemoryGB: Math.floor(os.totalmem() / 1024 / 1024 / 1024),
    };
  }

  private static getCPUUsage(): Promise<number> {
    return new Promise<number>(resolve => {
      osUtils.cpuUsage(resolve);
    });
  }

  private static getRAMUsage(): number {
    const totalMem = osUtils.totalmem();
    const freeMem = osUtils.freemem();
    return (totalMem - freeMem) / totalMem;
  }

  private static getStorageData(): { total: number; usage: number } {
    const stats = fs.statfsSync(process.platform === 'win32' ? 'C://' : '/');
    const total = stats.bsize * stats.blocks;
    const free = stats.bsize * stats.bfree;

    return {
      total: Math.floor(total / 1_000_000_000),
      usage: 1 - free / total,
    };
  }
}

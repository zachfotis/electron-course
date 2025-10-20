import { app } from 'electron';
import path from 'path';

enum Environment {
  Development = 'development',
  Production = 'production',
}

export class SystemUtilities {
  public static isDevelopmentEnv(): boolean {
    return process.env.NODE_ENV === Environment.Development;
  }

  public static getPreloadPath(): string {
    return path.join(app.getAppPath(), SystemUtilities.isDevelopmentEnv() ? '.' : '..', 'dist-electron', 'preload.cjs');
  }
}

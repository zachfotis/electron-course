import { app, ipcMain, type WebContents, type WebFrameMain } from 'electron';
import path from 'path';
import { pathToFileURL } from 'url';

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

  public static getUIPath(): string {
    return path.join(app.getAppPath(), 'dist-react', 'index.html');
  }

  public static getUIURL(): URL {
    return new URL('http://localhost:5123');
  }

  public static ipcMainHandle<Key extends keyof EventPayloadMapping>(
    key: Key,
    handler: () => EventPayloadMapping[Key],
  ) {
    ipcMain.handle(key, event => {
      SystemUtilities.validateEventFrame(event.senderFrame);
      return handler();
    });
  }

  public static ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
    key: Key,
    webContents: WebContents,
    payload: EventPayloadMapping[Key],
  ) {
    webContents.send(key, payload);
  }

  public static validateEventFrame(frame: WebFrameMain | null): void {
    if (!frame) {
      throw new Error('Malicious event');
    }

    if (SystemUtilities.isDevelopmentEnv() && new URL(frame.url).host === SystemUtilities.getUIURL().host) {
      return;
    }
    if (frame.url !== pathToFileURL(SystemUtilities.getUIPath()).toString()) {
      throw new Error('Malicious event');
    }
  }
}

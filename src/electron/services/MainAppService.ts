import { app, BrowserWindow } from 'electron';
import path from 'path';
import { ResourceManager } from './ResourceManager.js';
import { SystemUtilities } from './SystemUtilities.js';

enum MAIN_APP_EVENTS {
  READY = 'ready',
}

export class MainAppService {
  private static readonly REACT_DEV_URL = 'http://localhost:5123';
  private static readonly REACT_PROD_PATH = path.join(app.getAppPath(), 'dist-react', 'index.html');

  public static initialize(): void {
    app.on(MAIN_APP_EVENTS.READY, MainAppService.onAppReady);
  }

  private static onAppReady(): void {
    const mainWindow = new BrowserWindow({
      webPreferences: {
        preload: SystemUtilities.getPreloadPath(),
      },
    });

    if (SystemUtilities.isDevelopmentEnv()) {
      mainWindow.loadURL(MainAppService.REACT_DEV_URL);
    } else {
      mainWindow.loadFile(MainAppService.REACT_PROD_PATH);
    }

    ResourceManager.pollResources(mainWindow);
  }
}

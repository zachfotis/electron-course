import { app, BrowserWindow } from 'electron';
import { ResourceManager } from './ResourceManager.js';
import { SystemUtilities } from './SystemUtilities.js';

enum MAIN_APP_EVENTS {
  READY = 'ready',
}

export class MainAppService {

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
      mainWindow.loadURL(SystemUtilities.getUIURL().toString());
    } else {
      mainWindow.loadFile(SystemUtilities.getUIPath());
    }

    ResourceManager.pollResources(mainWindow);

    SystemUtilities.ipcMainHandle('staticData', () => {
      return ResourceManager.getStaticData();
    });
  }
}

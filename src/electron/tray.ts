import { BrowserWindow, Menu, Tray, app } from 'electron';
import path from 'path';
import { SystemUtilities } from './services/SystemUtilities.js';

export function createTray(mainWindow: BrowserWindow) {
  const tray = new Tray(
    path.join(SystemUtilities.getAssetPath(), process.platform === 'darwin' ? 'trayIconTemplate.png' : 'trayIcon.png'),
  );

  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: 'Show',
        click: () => {
          mainWindow.show();
          if (app.dock) {
            app.dock.show();
          }
        },
      },
      {
        label: 'Quit',
        click: () => app.quit(),
      },
    ]),
  );
}

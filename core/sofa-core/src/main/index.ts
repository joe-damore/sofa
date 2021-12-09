import { app, BrowserWindow, ipcMain } from 'electron';
import { Store } from '@src/core/data/store';

import path from 'path';

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      devTools: true,
      preload: path.resolve('./dist/renderers/app/renderer.preload.js'),
    },
  });

  win.webContents.openDevTools();

  win.loadFile('./dist/renderers/app/index.html');
};

app.whenReady().then(() => {
  createWindow();
});

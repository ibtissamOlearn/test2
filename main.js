const { app, BrowserWindow, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');

let mainWindow;
autoUpdater.setFeedURL({
    provider: 'github',
    owner: 'ibtissamOlearn',
    repo: 'test2'
});
Object.defineProperty(app, 'isPackaged', {
    get() {
      return true;
    }
  });

autoUpdater.autoDownload = false ;
autoUpdater.autoInstallOnAppQuit = true;
  
app.on('ready', function() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.webContents.on('did-finish-load', function() {
    const appVersion = app.getVersion();
    mainWindow.webContents.send('app-version', appVersion);

    autoUpdater.checkForUpdatesAndNotify();
  });

  autoUpdater.on('update-available', function(info) {
    const updateMessage = `A new version (${info.version}) of the app is available. Do you want to download and install it now?`;
    const buttons = ['Download', 'Later'];
    const options = { type: 'question', buttons: buttons, defaultId: 0, title: 'Update Available', message: updateMessage };

    dialog.showMessageBox(mainWindow, options).then(function({ response }) {
      if (response === 0) {
        autoUpdater.downloadUpdate();
      }
    });
  });

  autoUpdater.on('update-downloaded', function(info) {
    const updateMessage = `A new version (${info.version}) of the app has been downloaded. Do you want to restart the app now to install the update?`;
    const buttons = ['Restart', 'Later'];
    const options = { type: 'question', buttons: buttons, defaultId: 0, title: 'Update Downloaded', message: updateMessage };

    dialog.showMessageBox(mainWindow, options).then(function({ response }) {
      if (response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });
});

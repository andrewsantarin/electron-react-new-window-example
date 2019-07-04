const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let browserWindow;

function destroyBrowserWindow() {
  browserWindow = null;
}

function createBrowserWindow() {
  browserWindow = new BrowserWindow({
    width: 900,
    height: 680,
    // This is important!
    webPreferences: {
      nativeWindowOpen: true,
      nodeIntegrationInSubFrames: true,
      nodeIntegration: true,
    },
  });

  browserWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, './build/index.html')}`
  );

  browserWindow.on('closed', destroyBrowserWindow);

  // Okay, the suggested solution to multiple windows shown below doesn't suit my needs.
  // So, I think I won't need this.
  // https://github.com/electron-react-boilerplate/electron-react-boilerplate/issues/623#issuecomment-333750155
  // #region
  /**
  browserWindow.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
    console.log(util.inspect({
      event, url, frameName, disposition, options, additionalFeatures
    }));
    if (frameName === 'modal') {
      // open window as modal
      event.preventDefault()
      Object.assign(options, {
        // modal: true,
        parent: browserWindow,
        // width: 100,
        // height: 100
      })
      event.newGuest = new BrowserWindow(options)
    }
  });

  let browserWindowA = new BrowserWindow(
    {
      name: 'window-a',
      width: 400,
      height: 300,
    }
  );
  browserWindowA.loadURL(
    isDev
      ? 'http://localhost:3000?update'
      : `file://${path.join(__dirname, './build/index.html?update')}`
  );

  let browserWindowB = new BrowserWindow(
    {
      name: 'window-b',
      width: 400,
      height: 300,
    }
  );
  browserWindowB.loadURL(
    isDev
      ? 'http://localhost:3000?console'
      : `file://${path.join(__dirname, './build/index.html?console')}`
  );
  */
  // #endregion
}

function quitApp() {
  if (process.platform === 'darwin') {
    return;
  }

  app.quit();
}

function startApp() {
  if (browserWindow !== null) {
    return;
  }

  createBrowserWindow();
}

app.on('ready', createBrowserWindow);
app.on('activate', startApp);
app.on('browserWindow-all-closed', quitApp);

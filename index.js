const defaultMenu = require('electron-default-menu');
const WindowState = require('electron-window-state');
const electron = require('electron');
const Menu = electron.Menu;
const Path = require('path');

const windows = {};
let quitting = false;

electron.app.on('ready', () => {
  startMenus();

  startBackgroundProcess();
  // wait until server has started before opening main window
  electron.ipcMain.once('server-started', function (ev, config) {
    openMainWindow();
  });

  electron.app.on('before-quit', function () {
    quitting = true;
  });

  electron.app.on('activate', function (e) {
    // reopen the app when dock icon clicked on macOS
    if (windows.main) {
      windows.main.show();
    }
  });

  // allow inspecting of background process
  electron.ipcMain.on('open-background-devtools', function (ev, config) {
    if (windows.background) {
      windows.background.webContents.openDevTools({ detach: true });
    }
  });
})

function startBackgroundProcess () {
  if (windows.background) {
    return;
  }

  windows.background = openWindow(Path.join(__dirname, 'server.js'), {
    title: 'hacky-art-server',
    show: false,
    connect: false,
    width: 150,
    height: 150,
    center: true,
    fullscreen: false,
    fullscreenable: false,
    maximizable: false,
    minimizable: false,
    resizable: false,
    skipTaskbar: true,
    useContentSize: true
  });
}

function openMainWindow () {
  if (windows.main) {
    return;
  }

  const windowState = WindowState({
    defaultWidth: 1024,
    defaultHeight: 768,
  });
  windows.main = openWindow(Path.join(__dirname, 'main.js'), {
    title: 'HackyArt',
    show: true,
    x: windowState.x,
    y: windowState.y,
    minWidth: 800,
    width: windowState.width,
    height: windowState.height,
    autoHideMenuBar: true,
    frame: !process.env.FRAME,
    backgroundColor: '#FFF',
  });
  windowState.manage(windows.main);
  windows.main.setSheetOffset(40);
  windows.main.on('close', function (e) {
    if (!quitting && process.platform === 'darwin') {
      e.preventDefault();
      windows.main.hide();
    }
  });
  windows.main.on('closed', function () {
    windows.main = null;
    if (process.platform !== 'darwin') {
      electron.app.quit();
    }
  });
}

function openWindow (path, opts) {
  const window = new electron.BrowserWindow(opts);

  window.webContents.on('dom-ready', function () {
    window.webContents.executeJavaScript(`
      require(${JSON.stringify(path)})
    `);
  })

  window.webContents.on('will-navigate', function (e, url) {
    e.preventDefault();
    electron.shell.openExternal(url);
  });

  window.webContents.on('new-window', function (e, url) {
    e.preventDefault();
    electron.shell.openExternal(url);
  });

  window.loadURL('file://' + Path.join(__dirname, 'assets', 'base.html'));
  return window;
}

function startMenus () {
  const menu = defaultMenu(electron.app, electron.shell);
  const view = menu.find(x => x.label === 'View');
  view.submenu = [
    { role: 'reload' },
    { role: 'toggledevtools' },
    { type: 'separator' },
    { role: 'resetzoom' },
    { role: 'zoomin' },
    { role: 'zoomout' },
    { type: 'separator' },
    { role: 'togglefullscreen' }
  ];
  const win = menu.find(x => x.label === 'Window');
  win.submenu = [
    { role: 'minimize' },
    { role: 'zoom' },
    { role: 'close', label: 'Close Window', accelerator: 'CmdOrCtrl+Shift+W' },
    { type: 'separator' },
    {
      label: 'Close Tab',
      accelerator: 'CmdOrCtrl+W',
      click () {
        windows.main.webContents.send('closeTab')
      }
    },
    { type: 'separator' },
    { role: 'front' }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
}

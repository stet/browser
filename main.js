const { app, BrowserWindow, shell } = require('electron')

// setup auto updates
require('update-electron-app')()

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      devTools: false,
      contextIsolation: true,
      sandbox: true,
    }
  })

  win.loadURL("https://stet.art");

  win.on('page-title-updated', (evt) => {
    evt.preventDefault();
  });

  win.webContents.on('will-navigate', function(event, url) {
    handleNavigate(win, event, url);
  });

  win.webContents.on('new-window', function(event, url) {
    handleNavigate(win, event, url);
  });
}

function handleNavigate(win, event, url) {
  win.setTitle(url);

  // Allow bitclout-approved URLs
  if (url.startsWith('https://stetnode.com/') || url.startsWith('https://stet.art') || url.includes('stet.art') || url.startsWith('https://stetzine.com') || url.startsWith('https://identity.bitclout.com') || url.startsWith('https://auth.bitclout.id')) {
    return;
  }

  event.preventDefault();

  // Only allow URLs and emails
  if(!url.startsWith('https://') && !url.startsWith('http://') && !url.startsWith('mailto:')) {
    return;
  }

  // Open https links in external browser
  shell.openExternal(url);
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

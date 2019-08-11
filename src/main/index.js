'use strict'

import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 1920 / 3,
    useContentSize: true,
    width: 1080 / 3,
    show: false
  })

  mainWindow.loadURL(winURL)

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// regist listener
ipcMain.on('REQUEST_APP_VERSION', (event, arg) => {
  event.returnValue = app.getVersion()
})

ipcMain.on('REQUEST_UPDATE_APP', (event) => {
  console.log(autoUpdater.checkForUpdates())
  event.returnValue = autoUpdater.checkForUpdates()
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */
autoUpdater.logger = require('electron-log')
autoUpdater.logger.transports.file.level = 'info'

autoUpdater.on('update-downloaded', () => {
  console.log('update-download lats quitAndInstall')

  if (process.env.NODE_ENV === 'production') {
    dialog.showMessageBox({
      type: 'info',
      title: '发现更新',
      message: '发现更新，是否现在更新？',
      buttons: ['现在更新', '取消']
    }, (buttonIndex) => {
      if (buttonIndex === 0) {
        const isSilent = true
        const isForceRunAfter = true
        autoUpdater.quitAndInstall(isSilent, isForceRunAfter)
      }
    })
  }
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') {
    autoUpdater.checkForUpdates()
  }

  createWindow()
})

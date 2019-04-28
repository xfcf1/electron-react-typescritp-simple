import * as path from 'path'
import { app, Tray, Menu, nativeImage } from 'electron'
import { autoUpdater } from 'electron-updater'
import icon from '../assets/icon.png'
import pkg from '../../package.json'
import { isDev, isTest } from '../utils/env'
const isHot = process.env.HOT === 'true'
let versionName = ''
if (isDev) {
  versionName = '-Dev'
} else if (isTest) {
  versionName = '-Test'
}
let trayIcon: any
if (isHot) {
  trayIcon = icon
} else {
  trayIcon = path.join(__dirname, './icon.png')
}

// 系统托盘
function createTray(mainWindow: Electron.BrowserWindow) {
  const productName = `${pkg.name}-${pkg.version}${versionName}`
  const tray: Electron.Tray = new Tray(nativeImage.createFromPath(trayIcon))
  const contextMenu = Menu.buildFromTemplate([
    { label: productName, type: 'normal', enabled: false },
    {
      label: '检查更新',
      type: 'normal',
      click: () => {
        autoUpdater.checkForUpdates()
      }
    },
    { type: 'separator' },
    {
      label: '显示',
      type: 'normal',
      click: () => {
        mainWindow.restore()
        mainWindow.show()
      }
    },
    {
      label: '退出',
      type: 'normal',
      click: () => {
        app.quit()
      }
    },
  ])
  tray.setToolTip(productName)
  tray.setContextMenu(contextMenu)
  tray.on('double-click', () => {
    mainWindow.restore()
    mainWindow.show()
  })
  return tray
}

export default createTray
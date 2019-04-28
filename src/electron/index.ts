import { autoUpdater } from 'electron-updater'
import { app, ipcMain } from 'electron'
import log from 'electron-log'
import Urls from '../utils/urls'
import MainWindow from './windows/mainWindow'
import createTray from './tray'

// 保持对window对象的全局引用，如果不这么做的话，当JavaScript对象被
// 垃圾回收的时候，window对象将会自动的关闭
let mainWindow: Electron.BrowserWindow

function createWindow() {
  const win = new MainWindow()
  win.init()
  mainWindow = win.getWindow()

  createTray(mainWindow)
  updateHandle()
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow)

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 在macOS上，当单击dock图标并且没有其他窗口打开时，
// 通常在应用程序中重新创建一个窗口。
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  } else {
    mainWindow.restore()
  }
})

// web唤醒私有协议
app.setAsDefaultProtocolClient('reactDemo')
app.on('open-url', (event, url) => {
  event.preventDefault()
  if (mainWindow) {
    mainWindow.webContents.send('open-url', url)
  }
})

// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
function updateHandle() {
  const message = {
    error: '检查更新出错',
    checking: '正在检查更新……',
    updateAva: '检测到新版本，正在下载……',
    updateNotAva: '现在使用的就是最新版本，不用更新',
  }

  autoUpdater.setFeedURL(Urls.clientUpdate)
  autoUpdater.on('error', (error) => {
    sendUpdateMessage({ error, message: message.error })
  })
  autoUpdater.on('checking-for-update', () => {
    sendUpdateMessage(message.checking)
  })
  autoUpdater.on('update-available', (info) => {
    sendUpdateMessage(message.updateAva)
  })
  autoUpdater.on('update-not-available', (info) => {
    sendUpdateMessage({ message: message.updateNotAva })
  })

  // 更新下载进度事件
  autoUpdater.on('download-progress', (progressObj) => {
    mainWindow.webContents.send('downloadProgress', progressObj)
  })
  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) => {

    ipcMain.on('isUpdateNow', (e: Electron.Event, arg: any) => {
      console.log(e, arg)
      console.log('开始更新')
      // some code here to handle event
      autoUpdater.quitAndInstall()
    })

    mainWindow.webContents.send('isUpdateNow')
  })

  ipcMain.on('checkForUpdate', () => {
    // 执行自动更新检查
    autoUpdater.checkForUpdates()
  })
}

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(text: any) {
  log.info('on update', text)
  mainWindow.webContents.send('message', text)
}

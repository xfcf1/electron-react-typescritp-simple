import * as path from 'path'
import * as os from 'os'
import { BrowserWindow, ipcMain } from 'electron'
import BaseWindow from './baseWindow'
import { MianWinConfig } from '../config/window'
import Urls from '../../utils/urls'
const isHot = process.env.HOT === 'true'

class MainWindow extends BaseWindow {
  private win: Electron.BrowserWindow
  private isMaxWin: boolean

  constructor() {
    super('mainWindow')
  }
  public init() {
    if (isHot) {
      // 添加react devtool
      // BrowserWindow.addDevToolsExtension(
      //   path.join(
      //     os.homedir(),
      //     '/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/3.6.0_0',
      //   ),
      // )
    }
    this.win = new BrowserWindow(MianWinConfig)
    super.init(this.win)
    this.bindWindowEvent()
    if (!isHot) {
      // 打包环境加载本地网页
      this.win.loadURL(
        `file:///${path.join(__dirname, '..', 'dist', 'index.html')}`,
      )
    } else {
      // 开发环境加载本地server
      this.win.loadURL(Urls.localServer)
      this.openDevTools()
    }
    this.isMaxWin = false
  }

  public bindWindowEvent() {
    ipcMain.on('hideApp', () => {
      this.win.hide()
    })
    ipcMain.on('minApp', () => {
      this.win.minimize()
    })
    ipcMain.on('maxApp', () => {
      if (this.isMaxWin) {
        this.win.unmaximize()
        this.isMaxWin = false
      } else {
        this.win.maximize()
        this.isMaxWin = true
      }
    })
    ipcMain.on('fullApp', () => {
      this.win.setFullScreen(!this.win.isFullScreen())
    })
    ipcMain.on('open-inspect', () => {
      this.openDevTools()
    })
  }
}

export default MainWindow

import log from 'electron-log'
import { app, dialog, Menu } from 'electron'
import { isMac, isProd } from '../../utils/env'
import menuConfig from '../config/menu'

export default class CreateWindow {
  private name: string
  private window: any
  private isClosed: boolean
  private isShown: boolean

  constructor(name: string) {
    this.name = name
  }

  public init(win: Electron.BrowserWindow) {
    this.window = win
    this.isClosed = false
    this.isShown = true

    this.bindMenu()
    this.bindEvent()
    if (isProd) {
      // 正式环境才启用，否则debug会未响应
      this.recovery()
    }
    // this.addInspect()
  }

  public sendEvent(name: string, ...params: any) {
    log.info(`${this.name}: send event(${name}) data: ${params}`)
    this.window.webContents.send(name, ...params)
  }

  public openDevTools() {
    this.window.webContents.openDevTools()
  }

  public onLoad(callback: any) {
    log.info(`${this.name}: onLoad`)

    this.window.webContents.on('did-finish-load', () => {
      log.info(`did finish load ${this.name}`)
      callback()
    })
  }

  public onShow() {
    log.info(`${this.name}: onShow`)
  }

  public isAlive() {
    return !this.isClosed && !this.window.isDestroyed()
  }

  public getWindow() {
    return this.window
  }

  public bindEvent() {
    this.window.on('closed', () => {
      app.quit()
      this.window = null
    })
    this.window.on('hide', () => {
      log.info(`${this.name}: hide`)
    })

    this.window.on('show', () => {
      log.info(`${this.name}: show`)
    })

    this.window.on('close', () => {
      // warning: 不要在此处调用 e.preventDefault()，会导致程序无法正常退出！！！
      log.info(`${this.name}: close`)
      this.isClosed = true
    })
  }

  public show() {
    if (isMac) {
      app.show()
    }

    app.focus()

    if (this.window.isMinimized()) {
      this.window.restore()
    }

    this.window.show()
  }

  public hide() {
    this.window.hide()
    this.isShown = false
  }

  public destroy() {
    log.info(`${this.name}: destroy`)

    if (this.isClosed || this.window.isDestroyed()) {
      return
    }

    this.window.destroy()

    this.isClosed = true
  }

  public close() {
    if (this.isClosed) {
      return
    }

    this.window.close()
    this.isClosed = true
  }

  public recovery() {
    this.window.webContents.on('crashed', () => {
      log.info(`crashed: ${this.name}`)

      dialog.showMessageBox(
        {
          type: 'info',
          title: '崩溃',
          message: '程序崩溃',
          buttons: ['恢复', '退出'],
        },
        index => {
          if (index === 0) {
            this.window.reload()
          } else {
            app.quit()
          }
        },
      )
    })

    this.window.on('unresponsive', () => {
      dialog.showMessageBox(
        {
          type: 'info',
          title: '未响应',
          message: '程序未响应',
          buttons: ['恢复', '退出'],
        },
        index => {
          if (index === 0) {
            this.window.reload()
          } else {
            app.quit()
          }
        },
      )
    })
  }

  public bindMenu() {
    const menu = Menu.buildFromTemplate(menuConfig(this.window))
    Menu.setApplicationMenu(menu)
  }

  public addInspect() {
    log.info(`${this.name}: add inspect`)
    if (isProd) {
      return
    }

    this.window.webContents.on(
      'context-menu',
      (e: any, { x, y }: { x: number; y: number }) => {
        Menu.buildFromTemplate([
          {
            label: '审查元素',
            click: () => {
              this.window.inspectElement(x, y)
            },
          },
        ]).popup(this.window)
      },
    )
  }
}

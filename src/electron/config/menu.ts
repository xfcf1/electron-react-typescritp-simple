import { app, shell } from 'electron'
import { autoUpdater } from 'electron-updater'
import pkg from '../../../package.json'
import { isDev, isTest, isProd } from '../../utils/env'
let versionName = ''
if (isDev) {
  versionName = '-Dev'
} else if (isTest) {
  versionName = '-Test'
}

export default function menuConfig(main: Electron.BrowserWindow): Electron.MenuItemConstructorOptions[] {
  return [
    {
      label: pkg.name,
      submenu: [
        {
          label: `版本号 ${pkg.version}${versionName}`,
          enabled: false,
        },
        {
          type: 'separator',
        },
        {
          label: `检查更新`,
          click() {
            autoUpdater.checkForUpdates()
          },
        },
        {
          type: 'separator',
        },
        {
          label: `隐藏`,
          accelerator: 'Command+H',
          role: 'hide',
        },
        {
          label: '隐藏其它',
          accelerator: 'Command+Shift+H',
          role: 'hideOtherApplications',
        },
        {
          label: '显示全部',
          role: 'unhideAllApplications',
        },
        {
          type: 'separator',
        },
        {
          label: '修复',
          click() {
            main.webContents.send('confirm-recovery')
          },
        },
        {
          type: 'separator',
        },
        {
          label: '退出',
          accelerator: 'Command+Q',
          click() {
            app.quit()
          },
        },
      ],
    },
    {
      label: '编辑',
      submenu: [
        {
          label: '撤消',
          accelerator: 'Command+Z',
          role: 'undo',
        },
        {
          label: '重做',
          accelerator: 'Shift+Command+Z',
          role: 'redo',
        },
        {
          type: 'separator',
        },
        {
          label: '剪切',
          accelerator: 'Command+X',
          role: 'cut',
        },
        {
          label: '复制',
          accelerator: 'Command+C',
          role: 'copy',
        },
        {
          label: '粘贴',
          accelerator: 'Command+V',
          role: 'paste',
        },
        {
          label: '选择全部',
          accelerator: 'Command+A',
          role: 'selectAll',
        },
      ],
    },
    {
      label: '显示',
      submenu: !isProd
        ? [
          {
            label: '重新加载',
            accelerator: 'Command+R',
            click() {
              main.webContents.reload()
            },
          },
          {
            label: '进入全屏幕',
            accelerator: 'Ctrl+Command+F',
            click() {
              main.setFullScreen(!main.isFullScreen())
            },
          },
        ]
        : [],
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '了解更多',
          click() {
            shell.openExternal('https://www.aikucun.com')
          }
        }
      ]
    }
  ]
}
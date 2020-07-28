import { WIN_MAIN_HEIGHT, WIN_MAIN_WIDTH } from '../../constants'

export const MianWinConfig = {
  width: WIN_MAIN_WIDTH,
  height: WIN_MAIN_HEIGHT,
  webPreferences: {
    nodeIntegration: true,
  },
}

export const WebViewConfig = {
  width: WIN_MAIN_WIDTH,
  height: WIN_MAIN_HEIGHT,
  title: '内部浏览器',
  webPreferences: {
    nodeIntegration: true,
  },
}

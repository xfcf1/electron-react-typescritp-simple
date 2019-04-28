import {
  ENV_DEV,
  ENV_TEST,
  ENV_PROD,
  MAC_CODE,
  WIN_CODE
} from '../constants'

export const APP_ENV = process.env.REACT_APP_ENV
export const isDev = APP_ENV === ENV_DEV
export const isTest = APP_ENV === ENV_TEST
export const isProd = APP_ENV === ENV_PROD
export const isMac = process.platform === MAC_CODE
export const isWin = process.platform === WIN_CODE
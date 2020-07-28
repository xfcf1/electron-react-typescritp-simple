import { isDev, isTest, isProd } from './env'
import pkg from '../../package.json'
import * as config from '../../build/config'

export interface IUrls {
  clientUpdate: string
  localServer: string
}

const Urls: IUrls = {
  clientUpdate: '',
  localServer: '',
}
const updateBaseUrl = pkg.build.publish[0].url

if (isDev) {
  Urls.clientUpdate = `${updateBaseUrl}/dev/`
  Urls.localServer = `http://localhost:${config.port}/`
} else if (isTest) {
  Urls.clientUpdate = `${updateBaseUrl}/test/`
  Urls.localServer = `http://localhost:${config.port}/`
} else if (isProd) {
  Urls.clientUpdate = `${updateBaseUrl}/prod/`
  Urls.localServer = `http://localhost:${config.port}/`
}

export default Urls

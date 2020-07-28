import * as React from 'react'
import { ipcRenderer } from 'electron'
import { hot } from 'react-hot-loader/root'
import './App.css'

import logo from '../assets/logo.svg'

class App extends React.Component {
  public componentDidMount() {
    // web唤醒私有协议
    ipcRenderer.on('open-url', (e: Electron.Event, url: any) => {
      console.log('url: ', url)
    })
    ipcRenderer.on('message', (e: Electron.Event, text: any) => {
      console.log('update: ', text)
    })
    ipcRenderer.on('download-progress', (e: Electron.Event, text: any) => {
      console.log('progress ', text)
    })
    ipcRenderer.on('isUpdateNow', (e: Electron.Event, text: any) => {
      console.log('isUpdateNow ', text)
    })
  }
  public componentWillMount() {
    ipcRenderer.removeAllListeners('open-url')
    ipcRenderer.removeAllListeners('message')
    ipcRenderer.removeAllListeners('download-progress')
    ipcRenderer.removeAllListeners('isUpdateNow')
  }
  public hide() {
    ipcRenderer.send('hideApp')
  }
  public min() {
    ipcRenderer.send('minApp')
  }
  public full() {
    ipcRenderer.send('fullApp')
  }
  public update() {
    ipcRenderer.send('checkForUpdate')
  }
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> 1and save to reload.
        </p>
        <br />
        <br />
        <br />
        <br />
        <div>
          <button onClick={() => this.hide()}>隐藏</button>
          <button onClick={() => this.min()}>缩小</button>
          <button onClick={() => this.full()}>全屏</button>
          <button onClick={() => this.update()}>检查更新</button>
        </div>
      </div>
    )
  }
}

export default hot(App)

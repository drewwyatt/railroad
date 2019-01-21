import { Application } from 'pixi.js'
import { toApp, setupApp } from './app'

const addToFrame = (a: Application) => {
  const frame = document.querySelector('#frame')
  frame && frame.appendChild(a.view)
}

const resize = (a: Application) => {
  const parent = a.view.parentNode
  if (parent) {
    a.renderer.resize(
      (parent as Element).clientWidth,
      (parent as Element).clientHeight
    )
  }
}

window.onload = () => {
  const app = toApp()
  addToFrame(app)
  resize(app)

  setupApp(app)

  window.addEventListener('resize', () => resize(app))
}

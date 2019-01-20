import app from './app'

const addToFrame = (a: typeof app) => {
  const frame = document.querySelector('#frame')
  frame && frame.appendChild(a.view)
}

const resize = (a: typeof app) => {
  const parent = a.view.parentNode
  if (parent) {
    a.renderer.resize(
      (parent as Element).clientWidth,
      (parent as Element).clientHeight
    )
  }
}

window.onload = () => {
  addToFrame(app)
  resize(app)
  window.addEventListener('resize', () => resize(app))
}

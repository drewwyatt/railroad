import { Container, Graphics } from 'pixi.js'

export const toStartArea = (): Container => {
  const startArea = new Container()
  startArea.position.set(50, 50)

  const color = new Graphics()
  color.beginFill(0xff0000)
  color.drawRect(0, 0, 200, 200)
  color.endFill()

  startArea.addChild(color)
  return startArea
}

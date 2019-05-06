import { Container, Graphics } from 'pixi.js'

export const toBoard = (): Container => {
  const board = new Container()
  board.position.set(500, 50)

  const color = new Graphics()
  color.beginFill(0x00ff00)
  color.drawRect(0, 0, 200, 200)
  color.endFill()

  board.addChild(color)
  return board
}

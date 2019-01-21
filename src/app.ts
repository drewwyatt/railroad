import { Application, Graphics } from 'pixi.js'
import Tile from './tile'

const tileBank = new Graphics()
  .beginFill(0xffff00)
  .lineStyle(5, 0xff0000)
  .drawRect(100, 100, 200, 200)

const grid = new Graphics()
  .beginFill(0x00ffff)
  .lineStyle(5, 0xff0000)
  .drawRect(500, 500, 200, 200)

const tile = new Tile('/intersection.png')

tile.setAllowedContainers([tileBank, grid])

const app = new Application(0, 0, { backgroundColor: 0x1099bb })

app.stage.addChild(tileBank)
app.stage.addChild(grid)
app.stage.addChild(tile.sprite)

export default app

import { Application, Graphics } from 'pixi.js'
import Tile from './tile'

const g = new Graphics()
const tileBank = g.drawRect(0, 0, 200, 200)
const tile = new Tile('/intersection.png')

tile.setAllowedContainers([tileBank])

const app = new Application(0, 0, { backgroundColor: 0x1099bb })

app.stage.addChild(tileBank)
app.stage.addChild(tile.sprite)

export default app

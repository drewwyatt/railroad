import { Application } from 'pixi.js'
import Tile from './tile'

const app = new Application(0, 0, { backgroundColor: 0x1099bb })

app.stage.addChild(new Tile('/intersection.png').sprite)

export default app

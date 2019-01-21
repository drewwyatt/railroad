import { Application } from 'pixi.js'
import Tile from './tile'

const app = new Application(0, 0, { backgroundColor: 0x1099bb })

const tiles = new Tile().tileObjects
tiles.forEach(tile => {
  app.stage.addChild(tile)
})

export default app

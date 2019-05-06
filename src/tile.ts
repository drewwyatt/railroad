import { interaction, Graphics, Container } from 'pixi.js'
import makeTileModel from './tile-model-factory'
import TileGraphics from './tile-graphics'

type Coords = { x: number; y: number }

export type InteractionHandler = (e: interaction.InteractionEvent, context: InteractionContext) => void

export type InteractionContext = {
  sprite: Graphics
  startContainer?: Container
  startPosition?: Coords
}

class Tile {
  sprite: Graphics

  constructor() {
    const width = 180
    const tileGraphics = new TileGraphics(width, 32)

    const model = makeTileModel(0)
    const sprite = tileGraphics.make(model)

    // Will respond to mouse and touch events
    sprite.interactive = true

    // the hand cursor appears when you hover with your mouse
    sprite.buttonMode = true

    sprite.x = 20
    sprite.y = 20
    this.sprite = sprite
  }
}

export default Tile

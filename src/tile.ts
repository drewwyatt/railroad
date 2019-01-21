import { interaction, Point, Graphics } from 'pixi.js'
import makeTileModel from './tile-model-factory'
import TileGraphics from './tile-graphics'

class Tile {
  sprite: Graphics
  private interactionData: interaction.InteractionData | null = null
  private deltaDragPoint = new Point(0, 0)
  private isDragging: boolean = false

  constructor() {
    const width = 180
    const tileGraphics = new TileGraphics(width, 32)

    const model = makeTileModel(0)
    const sprite = tileGraphics.make(model)

    // Will respond to mouse and touch events
    sprite.interactive = true

    // the hand cursor appears when you hover with your mouse
    sprite.buttonMode = true

    sprite
      .on('pointerdown', this.onDragStart)
      .on('pointerup', this.onDragEnd)
      .on('pointerupoutside', this.onDragEnd)
      .on('pointermove', this.onDragMove)

    sprite.x = 20
    sprite.y = 20
    this.sprite = sprite
  }

  private onDragStart = (e: interaction.InteractionEvent) => {
    this.interactionData = e.data
    const position = this.interactionData.getLocalPosition(this.sprite.parent)
    this.deltaDragPoint = new Point(position.x - this.sprite.x, position.y - this.sprite.y)
    console.log(this.deltaDragPoint)
    this.sprite.alpha = 0.5
    this.isDragging = true
  }

  private onDragEnd = () => {
    this.sprite.alpha = 1
    this.isDragging = false
    this.interactionData = null
  }

  private onDragMove = () => {
    if (this.isDragging && this.interactionData) {
      const { x, y } = this.interactionData.getLocalPosition(this.sprite.parent)
      this.sprite.x = x - this.deltaDragPoint.x
      this.sprite.y = y - this.deltaDragPoint.y
    }
  }
}

export default Tile

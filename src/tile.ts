import { interaction, Point, DisplayObject } from 'pixi.js'
import makeTileModel from './tile-model-factory'
import TileGraphics from './tile-graphics'

// enum RoadPosition {
//   Top, Right, Bottom, Left
// }

class Tile {
  tileObject: DisplayObject
  private interactionData: interaction.InteractionData | null = null
  private deltaDragPoint = new Point(0, 0)
  private isDragging: boolean = false

  constructor() {
    const model = makeTileModel(6)
    const tileGraphics = new TileGraphics(200, 32)
    const tileObject = tileGraphics.make(model)

    // Will respond to mouse and touch events
    tileObject.interactive = true

    // the hand cursor appears when you hover with your mouse
    tileObject.buttonMode = true

    tileObject
      .on('pointerdown', this.onDragStart)
      .on('pointerup', this.onDragEnd)
      .on('pointerupoutside', this.onDragEnd)
      .on('pointermove', this.onDragMove)

    tileObject.x = 20
    tileObject.y = 20
    this.tileObject = tileObject
  }

  private onDragStart = (e: interaction.InteractionEvent) => {
    this.interactionData = e.data
    const position = this.interactionData.getLocalPosition(
      this.tileObject.parent
    )
    this.deltaDragPoint = new Point(
      position.x - this.tileObject.x,
      position.y - this.tileObject.y
    )
    console.log(this.deltaDragPoint)
    this.tileObject.alpha = 0.5
    this.isDragging = true
  }

  private onDragEnd = () => {
    this.tileObject.alpha = 1
    this.isDragging = false
    this.interactionData = null
  }

  private onDragMove = () => {
    if (this.isDragging && this.interactionData) {
      const tileWidth = 400
      const { x, y } = this.interactionData.getLocalPosition(
        this.tileObject.parent
      )
      this.tileObject.x =
        Math.round((x - this.deltaDragPoint.x) / tileWidth) * tileWidth
      this.tileObject.y =
        Math.round((y - this.deltaDragPoint.y) / tileWidth) * tileWidth
    }
  }
}

export default Tile

import { interaction, Point, Graphics, Container } from 'pixi.js'
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
  private interactionData: interaction.InteractionData | null = null
  private deltaDragPoint = new Point(0, 0)
  private isDragging: boolean = false
  private startPosition?: Coords
  private startContainer?: Container

  constructor(private stage: Container) {
    const width = 180
    const tileGraphics = new TileGraphics(width, 32)

    const model = makeTileModel(0)
    const sprite = tileGraphics.make(model)

    // Will respond to mouse and touch events
    sprite.interactive = true

    // the hand cursor appears when you hover with your mouse
    sprite.buttonMode = true

    sprite
      .on('pointerdown', this._onDragStart)
      .on('pointerup', this._onDragEnd)
      .on('pointerupoutside', this._onDragEnd)
      .on('pointermove', this._onDragMove)

    sprite.x = 20
    sprite.y = 20
    this.sprite = sprite
  }

  onDragStart: InteractionHandler | null = null
  onDragEnd: InteractionHandler | null = null
  onDragMove: InteractionHandler | null = null

  private tryCallHandler = (handler: InteractionHandler | null, e: interaction.InteractionEvent) => {
    if (handler) {
      const { sprite, startContainer, startPosition } = this
      handler(e, { sprite, startContainer, startPosition })
    }
  }

  private _onDragStart = (e: interaction.InteractionEvent) => {
    this.interactionData = e.data
    const position = this.interactionData.getLocalPosition(this.sprite.parent)
    this.deltaDragPoint = new Point(position.x - this.sprite.x, position.y - this.sprite.y)
    console.log(this.deltaDragPoint)
    this.sprite.alpha = 0.5
    this.isDragging = true
    const { x, y } = this.sprite
    this.startPosition = { x, y }
    this.startContainer = this.sprite.parent

    this.sprite.setParent(this.stage)
    this.tryCallHandler(this.onDragStart, e)
  }

  private _onDragEnd = (e: interaction.InteractionEvent) => {
    this.sprite.alpha = 1
    this.isDragging = false

    this.tryCallHandler(this.onDragEnd, e)
    this.interactionData = null
    this.startContainer = undefined
    this.startPosition = undefined
    this.sprite.alpha = 1
  }

  private _onDragMove = (e: interaction.InteractionEvent) => {
    if (this.isDragging && this.interactionData) {
      const { x, y } = this.interactionData.getLocalPosition(this.sprite.parent)
      this.sprite.x = x - this.deltaDragPoint.x
      this.sprite.y = y - this.deltaDragPoint.y
    }

    this.tryCallHandler(this.onDragMove, e)
  }
}

export default Tile

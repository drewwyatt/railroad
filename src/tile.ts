import { Texture, SCALE_MODES, Sprite, interaction, Container } from 'pixi.js'

type Coords = { x: number; y: number }

export type InteractionHandler = (
  e: interaction.InteractionEvent,
  context: InteractionContext
) => void

export type InteractionContext = {
  sprite: Sprite
  startContainer?: Container
  startPosition?: Coords
}

class Tile {
  sprite: Sprite
  private interactionData: interaction.InteractionData | null = null
  private isDragging: boolean = false
  private startPosition?: Coords
  private startContainer?: Container

  constructor(imageUrl: string, private stage: Container) {
    const texture = Texture.fromImage(imageUrl)
    texture.baseTexture.scaleMode = SCALE_MODES.NEAREST
    const sprite = new Sprite(texture)

    // Will respond to mouse and touch events
    sprite.interactive = true

    // the hand cursor appears when you hover with your mouse
    sprite.buttonMode = true

    // anchor point is in center
    sprite.anchor.set(0.5)

    // make the giant demo image smaller
    sprite.scale.set(0.25)

    sprite
      .on('pointerdown', this._onDragStart)
      .on('pointerup', this._onDragEnd)
      .on('pointerupoutside', this._onDragEnd)
      .on('pointermove', this._onDragMove)

    this.sprite = sprite
  }

  onDragStart: InteractionHandler | null = null
  onDragEnd: InteractionHandler | null = null
  onDragMove: InteractionHandler | null = null

  private tryCallHandler = (
    handler: InteractionHandler | null,
    e: interaction.InteractionEvent
  ) => {
    if (handler) {
      const { sprite, startContainer, startPosition } = this
      handler(e, { sprite, startContainer, startPosition })
    }
  }

  private _onDragStart = (e: interaction.InteractionEvent) => {
    this.interactionData = e.data
    this.sprite.alpha = 0.5
    this.isDragging = true
    const { x, y } = this.sprite
    this.startPosition = { x, y }
    this.startContainer = this.sprite.parent

    this.sprite.setParent(this.stage)
    this.tryCallHandler(this.onDragStart, e)
  }

  private _onDragEnd = (e: interaction.InteractionEvent) => {
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
      this.sprite.x = x
      this.sprite.y = y
    }

    this.tryCallHandler(this.onDragMove, e)
  }
}

export default Tile

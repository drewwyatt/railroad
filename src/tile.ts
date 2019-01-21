import { Texture, SCALE_MODES, Sprite, interaction, Container } from 'pixi.js'

class Tile {
  sprite: Sprite
  private interactionData: interaction.InteractionData | null = null
  private isDragging: boolean = false
  private allowedContainers: Container[] = []

  constructor(imageUrl: string) {
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
      .on('pointerdown', this.onDragStart)
      .on('pointerup', this.onDragEnd)
      .on('pointerupoutside', this.onDragEnd)
      .on('pointermove', this.onDragMove)

    this.sprite = sprite
  }

  setAllowedContainers = (containers: Container[]) => {
    this.allowedContainers = containers
  }

  isColliding = (el: Container): boolean => {
    const { x: x1, y: y1, width: width1, height: height1 } = this.sprite
    const { x: x2, y: y2, width: width2, height: height2 } = el

    return (
      x1 < x2 + width2 &&
      x1 + width1 > x2 &&
      y1 < y2 + height2 &&
      y1 + height1 > y2
    )
  }

  private onDragStart = (e: interaction.InteractionEvent) => {
    this.interactionData = e.data
    this.sprite.alpha = 0.5
    this.isDragging = true
  }

  private onDragEnd = (_: interaction.InteractionEvent) => {
    this.sprite.alpha = 1
    this.isDragging = false
    this.interactionData = null
    console.log('Checking collisions...')
    this.allowedContainers.forEach((el, idx) => {
      console.log(`Colliding with el ${idx}?:`, this.isColliding(el))
    })
    console.log('Collision check complete.')
  }

  private onDragMove = (_: interaction.InteractionEvent) => {
    if (this.isDragging && this.interactionData) {
      const { x, y } = this.interactionData.getLocalPosition(this.sprite.parent)
      this.sprite.x = x
      this.sprite.y = y
    }
  }
}

export default Tile

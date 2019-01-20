import { Texture, SCALE_MODES, Sprite, interaction } from 'pixi.js';

class Tile {
  sprite: Sprite
  private interactionData: interaction.InteractionData | null = null
  private isDragging: boolean = false

  constructor(imageUrl: string) {
    const texture = Texture.fromImage(imageUrl)
    texture.baseTexture.scaleMode = SCALE_MODES.NEAREST
    const sprite = new Sprite(texture)

    // Will respond to mouse and touch events
    sprite.interactive = true

    // the hand cursor appears when you hover with your mouse
    sprite.buttonMode = true;

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

  private onDragStart = (e: interaction.InteractionEvent) => {
    this.interactionData = e.data
    this.sprite.alpha = 0.5
    this.isDragging = true
  }

  private onDragEnd = (_: interaction.InteractionEvent) => {
    this.sprite.alpha = 1
    this.isDragging = false
    this.interactionData = null
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

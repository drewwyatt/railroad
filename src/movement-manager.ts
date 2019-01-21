import { DisplayObject, interaction, Point } from 'pixi.js'

interface Draggable {
  deltaDragPoint?: Point
  interactionData?: interaction.InteractionData
  isBeingDragged: boolean
  ref: DisplayObject
}

class MovementManager {
  private draggables: ReadonlyArray<Draggable> = []

  add = (element: DisplayObject): void => {
    this.draggables = [...this.draggables, this.toDraggable(element)]
    this.resetListeners()
  }

  private toDraggable = (element: DisplayObject): Draggable => ({
    isBeingDragged: false,
    ref: element
  })

  private resetListeners = (): void => {
    this.draggables.forEach(d => d.ref.removeAllListeners())
    this.draggables.forEach(this.attachListenersToDraggable)
  }

  private attachListenersToDraggable = (draggable: Draggable, idx: number) => {
    draggable.ref
      .on('pointerdown', this.toOnDragStart(idx))
      .on('pointerup', this.toOnDragEnd(idx))
      .on('pointerupoutside', this.toOnDragEnd(idx))
      .on('pointermove', this.toOnDragMove(idx))
  }

  private getRef = (idx: number): DisplayObject => {
    return this.draggables[idx].ref
  }

  private updateDraggable = (update: Partial<Draggable>, idx: number) => {
    this.draggables = [
      ...this.draggables.slice(0, idx),
      { ...this.draggables[idx], ...update },
      ...this.draggables.slice(idx + 1)
    ]
  }

  private startDragging = (deltaDragPoint: Point, interactionData: interaction.InteractionData, idx: number): void => {
    this.updateDraggable({ deltaDragPoint, interactionData, isBeingDragged: true }, idx)
    this.getRef(idx).alpha = 0.5
  }

  private stopDragging = (idx: number) => {
    this.updateDraggable(
      {
        deltaDragPoint: undefined,
        interactionData: undefined,
        isBeingDragged: false
      },
      idx
    )
    this.getRef(idx).alpha = 1
  }

  private toOnDragStart = (idx: number) => ({ data: interactionData }: interaction.InteractionEvent) => {
    const { x, y, parent } = this.getRef(idx)
    const position = interactionData.getLocalPosition(parent)
    const deltaDragPoint = new Point(position.x - x, position.y - y)
    this.startDragging(deltaDragPoint, interactionData, idx)
  }

  private toOnDragEnd = (idx: number) => (_: interaction.InteractionEvent) => {
    this.stopDragging(idx)
  }

  private toOnDragMove = (idx: number) => (_: interaction.InteractionEvent) => {
    const { deltaDragPoint, isBeingDragged, interactionData } = this.draggables[idx]
    if (deltaDragPoint && interactionData && isBeingDragged) {
      const ref = this.getRef(idx)
      const { x, y } = interactionData.getLocalPosition(ref.parent)
      ref.x = x - deltaDragPoint.x
      ref.y = y - deltaDragPoint.y
    }
  }
}

export default MovementManager

import { Application, Container, Sprite, interaction } from 'pixi.js'
import Tile, { InteractionContext } from './tile'
import { toBoard } from './board'
import { toStartArea } from './start-area'
import { rectsAreIntersecting } from './utils'

export const toApp = (): Application => {
  return new Application(0, 0, { backgroundColor: 0x1099bb })
}

const calcCenter = (axis: 'width' | 'height') => (container: Container, sprite: Sprite): number =>
  container[axis] / 2 - sprite[axis] / 2

const centerX = calcCenter('width')
const centerY = calcCenter('height')

const centerIn = (container: Container, sprite: Sprite) =>
  sprite.position.set(centerX(container, sprite), centerY(container, sprite))

const positionSpriteInContainersBasedOnCollision = (containers: Container[]) => (
  _: interaction.InteractionEvent,
  context: InteractionContext
) => {
  const { sprite, startPosition } = context
  const intersectingContainer = containers.find(c => rectsAreIntersecting(c, sprite))
  if (intersectingContainer) {
    console.log('found intersecting container')
    // Drop it in the middle of the container
    centerIn(intersectingContainer, sprite)
  } else if (startPosition) {
    console.log('nope')
    // Move it bacl
    sprite.position.set(startPosition.x, startPosition.y)
  }
}

export const setupApp = (app: Application): void => {
  // Create elements
  const startArea = toStartArea()
  const board = toBoard()
  const tile = new Tile(app.stage)

  // Add them to stage
  app.stage.addChild(startArea)
  app.stage.addChild(board)

  startArea.addChild(tile.sprite)

  // Position tile in starting area
  centerIn(startArea, tile.sprite)

  // Attach handler
  tile.onDragEnd = positionSpriteInContainersBasedOnCollision([startArea, board])
}

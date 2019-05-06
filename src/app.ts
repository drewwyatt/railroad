import { Application, Graphics } from 'pixi.js'
import Tile from './tile'
import { toBoard } from './board'
import MovementManager from './movement-manager'
import { toStartArea } from './start-area'
import { centerIn } from './utils'

export const toApp = (): Application => {
  return new Application(0, 0, { backgroundColor: 0x1099bb })
}

// const positionSpriteInContainersBasedOnCollision = (containers: Graphics[]) => (
//   _: interaction.InteractionEvent,
//   context: InteractionContext
// ) => {
//   const { sprite, startPosition } = context
//   const intersectingContainer = containers.find(c => rectsAreIntersecting(c, sprite))
//   if (intersectingContainer) {
//     console.log('found intersecting container')
//     // Drop it in the middle of the container
//     centerIn(intersectingContainer, sprite)
//   } else if (startPosition) {
//     console.log('nope')
//     // Move it bacl
//     sprite.position.set(startPosition.x, startPosition.y)
//   }
// }

export const setupApp = (app: Application): void => {
  const movementManager = new MovementManager()

  // Create elements
  const startArea = toStartArea()
  const board = toBoard()
  const tile = new Tile()

  movementManager.add(tile.sprite)

  // Add them to stage
  app.stage.addChild(startArea)
  app.stage.addChild(board)

  startArea.addChild(tile.sprite)

  /**
   * Is there maybe a better way to standardise on this without having to
   * cast these to Graphics?
   */

  // Position tile in starting area
  centerIn(startArea as Graphics, tile.sprite)
}

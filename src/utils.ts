import { Graphics } from 'pixi.js'

type Coords = { x: number; y: number }

const getCenter = (rect: Graphics): Coords => ({
  x: rect.x + rect.width / 2,
  y: rect.y + rect.height / 2
})

export const rectsAreIntersecting = (r1: Graphics, r2: Graphics): boolean => {
  const r1Center = getCenter(r1)
  const r2Center = getCenter(r2)

  //Calculate the distance vector between the sprites
  const vx = r1Center.x - r2Center.x
  const vy = r1Center.y - r1Center.y

  //Figure out the combined half-widths and half-heights
  const combinedHalfWidths = r1.width / 2 + r2.width / 2
  const combinedHalfHeights = r1.width / 2 + r2.width / 2

  return Math.abs(vx) < combinedHalfWidths && Math.abs(vy) < combinedHalfHeights
}

const calcCenter = (axis: 'width' | 'height') => (container: Graphics, sprite: Graphics): number =>
  container[axis] / 2 - sprite[axis] / 2

const centerX = calcCenter('width')
const centerY = calcCenter('height')

export const centerIn = (container: Graphics, sprite: Graphics) =>
  sprite.position.set(centerX(container, sprite), centerY(container, sprite))

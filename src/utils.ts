import { Container } from 'pixi.js'

type Coords = { x: number; y: number }

const getCenter = (rect: Container): Coords => ({
  x: rect.x + rect.width / 2,
  y: rect.y + rect.height / 2
})

export const rectsAreIntersecting = (r1: Container, r2: Container): boolean => {
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

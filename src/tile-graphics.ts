import { Graphics, Point } from 'pixi.js'
import { TileModel, RoadType, RoadAxis } from './tile-model'

enum RoadSide {
  Top,
  Right,
  Bottom,
  Left
}

class TileGraphics {
  tileWidth: number
  roadWidth: number

  tileCornerRadius: number = 20
  roadArcRadius: number = 20

  roadLineWidth: number = 4
  dashLineWidth: number = 2

  trainDashSpacing: number = 16
  trainDashLength: number = 18
  carDashLength: number = 12

  constructor(tileWidth: number, roadWidth: number) {
    this.tileWidth = tileWidth
    this.roadWidth = roadWidth
  }

  make = (tile: TileModel, existing?: Graphics): Graphics => {
    const graphics = existing || new Graphics()
    graphics.clear()

    graphics.lineStyle(this.roadLineWidth, 0x000000, 1.0)
    graphics.beginFill(0xffffff)
    graphics.drawRoundedRect(0, 0, this.tileWidth, this.tileWidth, this.tileCornerRadius)
    graphics.endFill()

    this.drawRoadSegments(tile, graphics)
    this.drawCenterCrossIfNecessary(tile, graphics)
    this.drawCenterBlockIfNecessary(tile, graphics)

    return graphics
  }

  // MARK: - Helpers

  private drawRoadSegments = (tile: TileModel, graphics: Graphics) => {
    const drawCarRoad = this.curriedDrawCarRoad(tile, graphics)
    const drawTrainRoad = this.curriedDrawTrainRoad(tile, graphics)

    if (tile.top == RoadType.Car) {
      drawCarRoad(RoadSide.Top)
    } else if (tile.top == RoadType.Train) {
      drawTrainRoad(RoadSide.Top)
    }

    if (tile.right == RoadType.Car) {
      drawCarRoad(RoadSide.Right)
    } else if (tile.right == RoadType.Train) {
      drawTrainRoad(RoadSide.Right)
    }

    if (tile.bottom == RoadType.Car) {
      drawCarRoad(RoadSide.Bottom)
    } else if (tile.bottom == RoadType.Train) {
      drawTrainRoad(RoadSide.Bottom)
    }

    if (tile.left == RoadType.Car) {
      drawCarRoad(RoadSide.Left)
    } else if (tile.left == RoadType.Train) {
      drawTrainRoad(RoadSide.Left)
    }
  }

  private drawCenterBlockIfNecessary = (tile: TileModel, graphics: Graphics) => {
    if (!tile.blocked) return
    const padding = 4
    graphics.beginFill(0x000000)
    graphics.drawRect(
      this.tileWidth / 2 - this.roadWidth / 2 - padding,
      this.tileWidth / 2 - this.roadWidth / 2 - padding,
      this.roadWidth + padding * 2,
      this.roadWidth + padding * 2
    )
    graphics.endFill()
  }

  private curriedDrawCarRoad = (tile: TileModel, graphics: Graphics) => (side: RoadSide) => {
    const drawCarRoadSegment = this.curriedDrawCarRoadSegment(tile, graphics)
    switch (side) {
      case RoadSide.Top:
        drawCarRoadSegment(tile.left, tile.bottom, tile.right, false, false, RoadAxis.TopBottom)
        drawCarRoadSegment(tile.right, tile.bottom, tile.left, true, false, RoadAxis.TopBottom)
        break
      case RoadSide.Right:
        drawCarRoadSegment(tile.top, tile.left, tile.bottom, true, false, RoadAxis.LeftRight)
        drawCarRoadSegment(tile.bottom, tile.left, tile.top, true, true, RoadAxis.LeftRight)
        break
      case RoadSide.Bottom:
        drawCarRoadSegment(tile.left, tile.top, tile.right, false, true, RoadAxis.TopBottom)
        drawCarRoadSegment(tile.right, tile.top, tile.left, true, true, RoadAxis.TopBottom)
        break
      case RoadSide.Left:
        drawCarRoadSegment(tile.top, tile.right, tile.bottom, false, false, RoadAxis.LeftRight)
        drawCarRoadSegment(tile.bottom, tile.right, tile.top, false, true, RoadAxis.LeftRight)
        break
    }
    this.drawCarRoadDashes(graphics, side)
  }

  private curriedDrawCarRoadSegment = (tile: TileModel, graphics: Graphics) => (
    adjacentRoadType: RoadType, // the road type of the adjacent road
    oppositeRoadType: RoadType, // the road type of road opposite of the one being drawn
    oppositeAdjacentRoadType: RoadType, // the road type of the road opposite of the adjacent road
    mirrorX: boolean, // whether the line is being drawn on the left or right side
    mirrorY: boolean, // whether the line is being drawn on the top or bottom side
    axis: RoadAxis // the axis of the road
  ) => {
    const midTile = this.tileWidth / 2
    const midRoad = this.roadWidth / 2

    const makePoint = this.curriedMakePoint(mirrorX, mirrorY, axis)
    const start = makePoint(0, midTile - midRoad)

    graphics.moveTo(start.x, start.y)
    if (!tile.blocked && adjacentRoadType == RoadType.Car) {
      const arcStart = makePoint(midTile - midRoad - this.roadArcRadius, midTile - midRoad)
      const arcCenter = makePoint(midTile - midRoad - this.roadArcRadius, midTile - midRoad - this.roadArcRadius)

      graphics.lineTo(arcStart.x, arcStart.y)
      graphics.arc(
        arcCenter.x,
        arcCenter.y,
        this.roadArcRadius,
        this.startAngle(mirrorX, mirrorY, axis),
        this.endAngle(mirrorX, mirrorY),
        this.counterclockwise(mirrorX, mirrorY, axis)
      )
    } else {
      const xPos = adjacentRoadType != RoadType.Car ? midTile : midTile - midRoad
      const lineEndWithoutArc = makePoint(xPos, midTile - midRoad)
      graphics.lineTo(lineEndWithoutArc.x, lineEndWithoutArc.y)

      const shouldDrawOuterArc = this.shouldDrawOuterArcForCarRoad(
        adjacentRoadType,
        oppositeRoadType,
        oppositeAdjacentRoadType
      )
      if (shouldDrawOuterArc) {
        const outerMirrorX = axis == RoadAxis.TopBottom ? !mirrorX : mirrorX
        const outerMirrorY = axis == RoadAxis.LeftRight ? !mirrorY : mirrorY
        graphics.arc(
          midTile,
          midTile,
          this.roadWidth / 2,
          this.startAngle(outerMirrorX, outerMirrorY, axis),
          this.endAngle(outerMirrorX, outerMirrorY),
          this.counterclockwise(outerMirrorX, outerMirrorY, axis)
        )
      }
    }
  }

  private drawCarRoadDashes = (graphics: Graphics, side: RoadSide) => {
    const axis = side == RoadSide.Left || side == RoadSide.Right ? RoadAxis.LeftRight : RoadAxis.TopBottom

    const mirrorX = side == RoadSide.Right
    const mirrorY = side == RoadSide.Bottom
    const makePoint = this.curriedMakePoint(mirrorX, mirrorY, axis)
    const midTile = this.tileWidth / 2

    const start = makePoint(0, midTile)
    graphics.moveTo(start.x, start.y)

    let currentX = 0
    graphics.lineStyle(this.dashLineWidth, 0x000000, 1.0)
    while (currentX < midTile) {
      currentX += this.carDashLength
      let nextPoint = makePoint(currentX, midTile)
      graphics.lineTo(nextPoint.x, nextPoint.y)
      currentX += this.carDashLength
      nextPoint = makePoint(currentX, midTile)
      graphics.moveTo(nextPoint.x, nextPoint.y)
    }
    graphics.lineStyle(this.roadLineWidth, 0x000000, 1.0)
  }

  private curriedDrawTrainRoad = (tile: TileModel, graphics: Graphics) => (
    side: RoadSide // the road side to draw
  ) => {
    const axis = side == RoadSide.Left || side == RoadSide.Right ? RoadAxis.LeftRight : RoadAxis.TopBottom
    const { curve, mirrorX, mirrorY } = this.curveAndMirrorTrain(tile, side)

    const makePoint = this.curriedMakePoint(mirrorX, mirrorY, axis)
    const start = makePoint(0, this.tileWidth / 2)
    graphics.moveTo(start.x, start.y)
    if (curve) {
      const arcStart = makePoint(this.tileWidth / 2 - this.roadArcRadius, this.tileWidth / 2)
      const arcCenter = makePoint(this.tileWidth / 2 - this.roadArcRadius, this.tileWidth / 2 - this.roadArcRadius)

      graphics.lineTo(arcStart.x, arcStart.y)
      graphics.arc(
        arcCenter.x,
        arcCenter.y,
        this.roadArcRadius,
        this.startAngle(mirrorX, mirrorY, axis),
        this.endAngle(mirrorX, mirrorY),
        this.counterclockwise(mirrorX, mirrorY, axis)
      )
    } else {
      // don't overlap an adjacent road
      const xPos = this.isAdjacentSideCarRoad(tile, side) ? this.tileWidth / 2 - this.roadWidth / 2 : this.tileWidth / 2
      const end = makePoint(xPos, this.tileWidth / 2)
      graphics.lineTo(end.x, end.y)
    }

    this.drawTrainDashes(tile, graphics, side)
  }

  private drawTrainDashes = (tile: TileModel, graphics: Graphics, side: RoadSide) => {
    const axis = side == RoadSide.Left || side == RoadSide.Right ? RoadAxis.LeftRight : RoadAxis.TopBottom

    const mirrorX = side == RoadSide.Right
    const mirrorY = side == RoadSide.Bottom
    const makePoint = this.curriedMakePoint(mirrorX, mirrorY, axis)
    const midTile = this.tileWidth / 2

    let end = 0
    if (tile.anyRoadsAreCars()) {
      end = midTile - this.roadWidth / 2
    } else if (this.shouldDrawCross(tile)) {
      end = midTile - this.trainDashSpacing
    } else {
      end = midTile
    }
    let currentX = this.trainDashSpacing

    graphics.lineStyle(this.dashLineWidth, 0x000000, 1.0)
    while (currentX < end) {
      let point = makePoint(currentX, midTile - this.trainDashLength / 2)
      graphics.moveTo(point.x, point.y)
      point = makePoint(currentX, midTile + this.trainDashLength / 2)
      graphics.lineTo(point.x, point.y)
      currentX += this.trainDashSpacing
    }
    graphics.lineStyle(this.roadLineWidth, 0x000000, 1.0)
  }

  private shouldDrawCross = (tile: TileModel): boolean => {
    if (tile.blocked || tile.anyRoadsAreCars()) {
      return false
    }

    let trainCount = 0
    if (tile.top == RoadType.Train) trainCount++
    if (tile.right == RoadType.Train) trainCount++
    if (tile.bottom == RoadType.Train) trainCount++
    if (tile.left == RoadType.Train) trainCount++
    return trainCount >= 3
  }

  private drawCenterCrossIfNecessary = (tile: TileModel, graphics: Graphics) => {
    if (!this.shouldDrawCross(tile)) return

    const centerOffset = 8
    const midTile = this.tileWidth / 2
    graphics.lineStyle(this.dashLineWidth, 0x000000, 1.0)
    graphics.moveTo(midTile - centerOffset, midTile - centerOffset)
    graphics.lineTo(midTile + centerOffset, midTile + centerOffset)
    graphics.moveTo(midTile + centerOffset, midTile - centerOffset)
    graphics.lineTo(midTile - centerOffset, midTile + centerOffset)
    graphics.lineStyle(this.roadLineWidth, 0x000000, 1.0)
  }

  private curriedMakePoint = (mirrorX: boolean, mirrorY: boolean, axis: RoadAxis) => (x: number, y: number): Point => {
    const newX = axis == RoadAxis.LeftRight ? x : y
    const newY = axis == RoadAxis.LeftRight ? y : x
    return new Point(mirrorX ? this.tileWidth - newX : newX, mirrorY ? this.tileWidth - newY : newY)
  }

  private startAngle = (mirrorX: boolean, mirrorY: boolean, axis: RoadAxis): number => {
    if (axis == RoadAxis.LeftRight && !mirrorY) {
      return Math.PI / 2
    } else if (axis == RoadAxis.LeftRight && mirrorY) {
      return (3 * Math.PI) / 2
    } else if (axis == RoadAxis.TopBottom && !mirrorX) {
      return 0
    } else {
      return Math.PI
    }
  }

  private endAngle = (mirrorX: boolean, mirrorY: boolean): number => {
    if (!mirrorX && !mirrorY) {
      // top left
      return Math.PI / 4
    } else if (!mirrorX && mirrorY) {
      // bottom left
      return (7 * Math.PI) / 4
    } else if (mirrorX && !mirrorY) {
      // top right
      return (3 * Math.PI) / 4
    } else {
      // bottom right
      return (5 * Math.PI) / 4
    }
  }

  private counterclockwise = (mirrorX: boolean, mirrorY: boolean, axis: RoadAxis): boolean => {
    if ((!mirrorX && !mirrorY) || (mirrorX && mirrorY)) {
      return axis == RoadAxis.LeftRight
    } else {
      return axis == RoadAxis.TopBottom
    }
  }

  private curveAndMirrorTrain = (
    tile: TileModel,
    side: RoadSide
  ): { curve: boolean; mirrorX: boolean; mirrorY: boolean } => {
    switch (side) {
      case RoadSide.Top:
        let curveRight = tile.right == RoadType.Train && tile.left == RoadType.None && tile.bottom == RoadType.None
        let curveLeft = tile.left == RoadType.Train && tile.right == RoadType.None && tile.bottom == RoadType.None
        return {
          curve: curveLeft || curveRight,
          mirrorX: curveRight,
          mirrorY: false
        }
      case RoadSide.Right:
        let curveTop = tile.top == RoadType.Train && tile.bottom == RoadType.None && tile.left == RoadType.None
        let curveBottom = tile.bottom == RoadType.Train && tile.top == RoadType.None && tile.left == RoadType.None
        return {
          curve: curveTop || curveBottom,
          mirrorX: true,
          mirrorY: curveBottom
        }
      case RoadSide.Bottom:
        curveRight = tile.right == RoadType.Train && tile.left == RoadType.None && tile.top == RoadType.None
        curveLeft = tile.left == RoadType.Train && tile.right == RoadType.None && tile.top == RoadType.None
        return {
          curve: curveLeft || curveRight,
          mirrorX: curveRight,
          mirrorY: true
        }
      case RoadSide.Left:
        curveTop = tile.top == RoadType.Train && tile.bottom == RoadType.None && tile.right == RoadType.None
        curveBottom = tile.bottom == RoadType.Train && tile.top == RoadType.None && tile.right == RoadType.None
        return {
          curve: curveTop || curveBottom,
          mirrorX: false,
          mirrorY: curveBottom
        }
    }
  }

  private isAdjacentSideCarRoad = (tile: TileModel, side: RoadSide): boolean => {
    switch (side) {
      case (RoadSide.Top, RoadSide.Bottom):
        return tile.left == RoadType.Car || tile.right == RoadType.Car
      default:
        return tile.top == RoadType.Car || tile.bottom == RoadType.Car
    }
  }

  private shouldDrawOuterArcForCarRoad = (
    adjacentType: RoadType,
    oppositeType: RoadType, // the type of road opposite the side being drawn
    oppositeAdjacentType: RoadType // the type of road opposite the adjacent side
  ): boolean => {
    return adjacentType == RoadType.None && oppositeType == RoadType.None && oppositeAdjacentType == RoadType.Car
  }
}

export default TileGraphics

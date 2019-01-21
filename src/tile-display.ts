import { DisplayObject, Graphics, Point } from 'pixi.js'

enum RoadType {
  None,
  Car,
  Train
}

class TileModel {
  top: RoadType
  right: RoadType
  bottom: RoadType
  left: RoadType
  blocked: boolean

  constructor() {
    this.top = RoadType.Car
    this.right = RoadType.Car
    this.bottom = RoadType.Car
    this.left = RoadType.Car
    this.blocked = false
  }

  makeGraphics = (tileWidth: number, roadWidth: number): DisplayObject => {
    const graphics = new Graphics()

    graphics.lineStyle(4, 0x000000, 1.0)
    graphics.beginFill(0xffffff)
    graphics.drawRoundedRect(0, 0, tileWidth, tileWidth, 20)
    graphics.endFill()

    const arcRadius = 20
    this.drawCarRoadSegments(graphics, tileWidth, roadWidth, arcRadius)

    return graphics
  }

  // MARK: - Car Roads

  private drawCarRoadSegments = (
    graphics: Graphics,
    tileWidth: number,
    roadWidth: number,
    arcRadius: number
  ) => {
    const drawCarRoadSegment = this.curriedDrawCarRoadSegment(graphics, tileWidth, roadWidth, arcRadius)
    // left
    drawCarRoadSegment(this.top, false, false, RoadAxis.LeftRight)
    drawCarRoadSegment(this.bottom, false, true, RoadAxis.LeftRight)

    // top
    drawCarRoadSegment(this.left, false, false, RoadAxis.TopBottom)
    drawCarRoadSegment(this.right, true, false, RoadAxis.TopBottom)

    // right
    drawCarRoadSegment(this.top, true, false, RoadAxis.LeftRight)
    drawCarRoadSegment(this.bottom, true, true, RoadAxis.LeftRight)

    // bottom
    drawCarRoadSegment(this.top, true, true, RoadAxis.TopBottom)
    drawCarRoadSegment(this.bottom, false, true, RoadAxis.TopBottom)
  }

  private curriedDrawCarRoadSegment = (
    graphics: Graphics,
    tileWidth: number,
    roadWidth: number,
    arcRadius: number
  ) => (
    adjacentRoadType: RoadType,
    mirrorX: boolean, // whether the line is being drawn on the left or right side
    mirrorY: boolean, // whether the line is being drawn on the top or bottom side
    axis: RoadAxis // the axis of the road
  ) => {
    const midTile = tileWidth / 2
    const midRoad = roadWidth / 2

    const makePoint = this.curriedMakePoint(tileWidth, mirrorX, mirrorY, axis)
    const start = makePoint(0, midTile - midRoad)
    
    graphics.moveTo(start.x, start.y)
    if (!this.blocked && adjacentRoadType == RoadType.Car) {
      const arcStart = makePoint(midTile - midRoad - arcRadius, midTile - midRoad)
      const arcCenter = makePoint(midTile - midRoad - arcRadius, midTile - midRoad - arcRadius)

      graphics.lineTo(arcStart.x, arcStart.y)
      graphics.arc(
        arcCenter.x,
        arcCenter.y,
        arcRadius,
        this.startAngle(mirrorX, mirrorY, axis),
        this.endAngle(mirrorX, mirrorY),
        this.counterclockwise(mirrorX, mirrorY, axis)
      )
    } else {
      const lineEndWithoutArc = makePoint(midTile - midRoad, midTile - midRoad)
      graphics.lineTo(lineEndWithoutArc.x, lineEndWithoutArc.y)
    }
  }

  private curriedMakePoint = (tileWidth: number, mirrorX: boolean, mirrorY: boolean, axis: RoadAxis) => (x: number, y: number): Point => {
    const newX = axis == RoadAxis.LeftRight ? x : y
    const newY = axis == RoadAxis.LeftRight ? y : x
    return new Point(mirrorX ? tileWidth - newX : newX, mirrorY ? tileWidth - newY : newY)
  }

  private startAngle = (mirrorX: boolean, mirrorY: boolean, axis: RoadAxis): number => {
    if (axis == RoadAxis.LeftRight && !mirrorY) {
      return Math.PI / 2
    } else if (axis == RoadAxis.LeftRight && mirrorY) {
      return 3 * Math.PI / 2
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
      return 7 * Math.PI / 4
    } else if (mirrorX && !mirrorY) {
      // top right
      return 3 * Math.PI / 4
    } else {
      // bottom right
      return 5 * Math.PI / 4
    }
  }

  private counterclockwise = (mirrorX: boolean, mirrorY: boolean, axis: RoadAxis): boolean => {
    if ((!mirrorX && !mirrorY) || (mirrorX && mirrorY)) {
      return (axis == RoadAxis.LeftRight)
    } else {
      return (axis == RoadAxis.TopBottom)
    }
  }
}

enum RoadAxis {
  LeftRight,
  TopBottom
}

export default TileModel

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
    this.right = RoadType.None
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
    this.drawLeftCarRoad(graphics, tileWidth, roadWidth, arcRadius)
    this.drawTopCarRoad(graphics, tileWidth, roadWidth, arcRadius)

    // this.drawLeftRoad(graphics, tileWidth, roadWidth, 20)
    // graphics.moveTo(0, midTile - midRoad)
    // graphics.lineTo(midTile - midRoad - this.arcRadius, midTile - midRoad)
    // graphics.arc(midTile - midRoad - this.arcRadius, midTile - midRoad - this.arcRadius, this.arcRadius, Math.PI / 2, 0, true)
    // graphics.lineTo(midTile - midRoad, 0)
    return graphics
  }

  // MARK: - Car Roads

  private drawLeftCarRoad = (
    graphics: Graphics,
    tileWidth: number,
    roadWidth: number,
    arcRadius: number
  ) => {
    this.drawCarRoadSegment(graphics, tileWidth, roadWidth, arcRadius, this.top, false, false, RoadAxis.LeftRight)
    this.drawCarRoadSegment(graphics, tileWidth, roadWidth, arcRadius, this.bottom, false, true, RoadAxis.LeftRight)
  }

  private drawTopCarRoad = (
    graphics: Graphics,
    tileWidth: number,
    roadWidth: number,
    arcRadius: number
  ) => {
    this.drawCarRoadSegment(graphics, tileWidth, roadWidth, arcRadius, this.left, false, false, RoadAxis.TopBottom)
    this.drawCarRoadSegment(graphics, tileWidth, roadWidth, arcRadius, this.right, true, false, RoadAxis.TopBottom)
  }

  private drawCarRoadSegment = (
    graphics: Graphics,
    tileWidth: number,
    roadWidth: number,
    arcRadius: number,
    adjacentRoadType: RoadType,
    mirrorX: boolean, // whether the line is being drawn on the left or right side
    mirrorY: boolean, // whether the line is being drawn on the top or bottom side
    axis: RoadAxis // the axis of the road
  ) => {
    const midTile = tileWidth / 2
    const midRoad = roadWidth / 2

    const makePoint = this.makeCurriedPoint(tileWidth, mirrorX, mirrorY, axis)
    const start = makePoint(0, midTile - midRoad)
    
    graphics.moveTo(start.x, start.y)
    if (!this.blocked && adjacentRoadType == RoadType.Car) {
      const arcStart = makePoint(midTile - midRoad - arcRadius, midTile - midRoad)
      const arcCenter = makePoint(midTile - midRoad - arcRadius, midTile - midRoad - arcRadius)
      const counterclockwise = (!mirrorX && axis == RoadAxis.LeftRight) || (mirrorX && axis == RoadAxis.TopBottom)

      graphics.lineTo(arcStart.x, arcStart.y)
      graphics.arc(
        arcCenter.x,
        arcCenter.y,
        arcRadius,
        this.startAngle(mirrorX, mirrorY, axis),
        this.endAngle(mirrorX, mirrorY, axis),
        counterclockwise
      )
    } else {
      const lineEndWithoutArc = makePoint(midTile - midRoad, midTile - midRoad)
      graphics.lineTo(lineEndWithoutArc.x, lineEndWithoutArc.y)
    }
  }

  private makeCurriedPoint = (tileWidth: number, mirrorX: boolean, mirrorY: boolean, axis: RoadAxis) => (x: number, y: number): Point => {
    const newX = mirrorX ? tileWidth - x : x
    const newY = mirrorY ? tileWidth - y : y
    return axis == RoadAxis.LeftRight ? new Point(newX, newY) : new Point(newY, newX)
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

  private endAngle = (mirrorX: boolean, mirrorY: boolean, axis: RoadAxis): number => {
    if (axis == RoadAxis.LeftRight && !mirrorY) {
      return 0
    } else if (axis == RoadAxis.LeftRight && mirrorY) {
      return Math.PI
    } else if (axis == RoadAxis.TopBottom && !mirrorX) {
      return Math.PI / 2
    } else {
      return 3 * Math.PI / 2
    }
  }
}

enum RoadAxis {
  LeftRight,
  TopBottom
}



export default TileModel

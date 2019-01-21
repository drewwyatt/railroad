import { Graphics, Point } from 'pixi.js'

enum RoadSide {
  Top,
  Right,
  Bottom,
  Left
}

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

  constructor(
    top: RoadType,
    right: RoadType,
    bottom: RoadType,
    left: RoadType,
    blocked: boolean
  ) {
    this.top = top
    this.right = right
    this.bottom = bottom
    this.left = left
    this.blocked = blocked
  }

  // MARK: - Public

  makeGraphics = (
    tileWidth: number,
    roadWidth: number,
    existing?: Graphics
  ): Graphics => {
    const graphics = existing || new Graphics()
    graphics.clear()

    graphics.lineStyle(4, 0x000000, 1.0)
    graphics.beginFill(0xffffff)
    graphics.drawRoundedRect(0, 0, tileWidth, tileWidth, 20)
    graphics.endFill()

    const arcRadius = 20
    this.drawRoadSegments(graphics, tileWidth, roadWidth, arcRadius)
    this.drawCenter(graphics, tileWidth, roadWidth)

    return graphics
  }

  // MARK: - Car Roads

  private drawRoadSegments = (
    graphics: Graphics,
    tileWidth: number,
    roadWidth: number,
    arcRadius: number
  ) => {
    const drawCarRoad = this.curriedDrawCarRoad(
      graphics,
      tileWidth,
      roadWidth,
      arcRadius
    )
    const drawTrainRoad = this.curriedDrawTrainRoad(
      graphics,
      tileWidth,
      roadWidth,
      arcRadius
    )

    if (this.top == RoadType.Car) {
      drawCarRoad(RoadSide.Top)
    } else if (this.top == RoadType.Train) {
      drawTrainRoad(RoadSide.Top)
    }

    if (this.right == RoadType.Car) {
      drawCarRoad(RoadSide.Right)
    } else if (this.right == RoadType.Train) {
      drawTrainRoad(RoadSide.Right)
    }

    if (this.bottom == RoadType.Car) {
      drawCarRoad(RoadSide.Bottom)
    } else if (this.bottom == RoadType.Train) {
      drawTrainRoad(RoadSide.Bottom)
    }

    if (this.left == RoadType.Car) {
      drawCarRoad(RoadSide.Left)
    } else if (this.left == RoadType.Train) {
      drawTrainRoad(RoadSide.Left)
    }
  }

  private drawCenter = (
    graphics: Graphics,
    tileWidth: number,
    roadWidth: number
  ) => {
    if (this.blocked) {
      const padding = 4
      graphics.beginFill(0x000000)
      graphics.drawRect(
        tileWidth / 2 - roadWidth / 2 - padding,
        tileWidth / 2 - roadWidth / 2 - padding,
        roadWidth + padding * 2,
        roadWidth + padding * 2
      )
      graphics.endFill()
    }
  }

  private curriedDrawCarRoad = (
    graphics: Graphics,
    tileWidth: number,
    roadWidth: number,
    arcRadius: number
  ) => (side: RoadSide) => {
    const drawCarRoadSegment = this.curriedDrawCarRoadSegment(
      graphics,
      tileWidth,
      roadWidth,
      arcRadius
    )
    switch (side) {
      case RoadSide.Top:
        drawCarRoadSegment(
          this.left,
          this.bottom,
          this.right,
          false,
          false,
          RoadAxis.TopBottom
        )
        drawCarRoadSegment(
          this.right,
          this.bottom,
          this.left,
          true,
          false,
          RoadAxis.TopBottom
        )
        break
      case RoadSide.Right:
        drawCarRoadSegment(
          this.top,
          this.left,
          this.bottom,
          true,
          false,
          RoadAxis.LeftRight
        )
        drawCarRoadSegment(
          this.bottom,
          this.left,
          this.top,
          true,
          true,
          RoadAxis.LeftRight
        )
        break
      case RoadSide.Bottom:
        drawCarRoadSegment(
          this.left,
          this.top,
          this.right,
          false,
          true,
          RoadAxis.TopBottom
        )
        drawCarRoadSegment(
          this.right,
          this.top,
          this.left,
          true,
          true,
          RoadAxis.TopBottom
        )
        break
      case RoadSide.Left:
        drawCarRoadSegment(
          this.top,
          this.right,
          this.bottom,
          false,
          false,
          RoadAxis.LeftRight
        )
        drawCarRoadSegment(
          this.bottom,
          this.right,
          this.top,
          false,
          true,
          RoadAxis.LeftRight
        )
        break
    }
  }

  private curriedDrawCarRoadSegment = (
    graphics: Graphics,
    tileWidth: number,
    roadWidth: number,
    arcRadius: number
  ) => (
    adjacentRoadType: RoadType, // the road type of the adjacent road
    oppositeRoadType: RoadType, // the road type of road opposite of the one being drawn
    oppositeAdjacentRoadType: RoadType, // the road type of the road opposite of the adjacent road
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
      const arcStart = makePoint(
        midTile - midRoad - arcRadius,
        midTile - midRoad
      )
      const arcCenter = makePoint(
        midTile - midRoad - arcRadius,
        midTile - midRoad - arcRadius
      )

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
      const xPos =
        adjacentRoadType != RoadType.Car ? midTile : midTile - midRoad
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
          roadWidth / 2,
          this.startAngle(outerMirrorX, outerMirrorY, axis),
          this.endAngle(outerMirrorX, outerMirrorY),
          this.counterclockwise(outerMirrorX, outerMirrorY, axis)
        )
      }
    }
  }

  private curriedDrawTrainRoad = (
    graphics: Graphics,
    tileWidth: number,
    roadWidth: number,
    arcRadius: number
  ) => (
    side: RoadSide // the road side to draw
  ) => {
    const axis =
      side == RoadSide.Left || side == RoadSide.Right
        ? RoadAxis.LeftRight
        : RoadAxis.TopBottom
    const { curve, mirrorX, mirrorY } = this.curveAndMirrorTrain(side)

    const makePoint = this.curriedMakePoint(tileWidth, mirrorX, mirrorY, axis)
    const start = makePoint(0, tileWidth / 2)
    graphics.moveTo(start.x, start.y)
    if (curve) {
      const arcStart = makePoint(tileWidth / 2 - arcRadius, tileWidth / 2)
      const arcCenter = makePoint(
        tileWidth / 2 - arcRadius,
        tileWidth / 2 - arcRadius
      )

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
      // don't overlap an adjacent road
      const xPos = this.isAdjacentSideCarRoad(side)
        ? tileWidth / 2 - roadWidth / 2
        : tileWidth / 2
      const end = makePoint(xPos, tileWidth / 2)
      graphics.lineTo(end.x, end.y)
    }
  }

  private curriedMakePoint = (
    tileWidth: number,
    mirrorX: boolean,
    mirrorY: boolean,
    axis: RoadAxis
  ) => (x: number, y: number): Point => {
    const newX = axis == RoadAxis.LeftRight ? x : y
    const newY = axis == RoadAxis.LeftRight ? y : x
    return new Point(
      mirrorX ? tileWidth - newX : newX,
      mirrorY ? tileWidth - newY : newY
    )
  }

  private startAngle = (
    mirrorX: boolean,
    mirrorY: boolean,
    axis: RoadAxis
  ): number => {
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

  private counterclockwise = (
    mirrorX: boolean,
    mirrorY: boolean,
    axis: RoadAxis
  ): boolean => {
    if ((!mirrorX && !mirrorY) || (mirrorX && mirrorY)) {
      return axis == RoadAxis.LeftRight
    } else {
      return axis == RoadAxis.TopBottom
    }
  }

  private curveAndMirrorTrain = (
    side: RoadSide
  ): { curve: boolean; mirrorX: boolean; mirrorY: boolean } => {
    switch (side) {
      case RoadSide.Top:
        let curveRight =
          this.right == RoadType.Train &&
          this.left == RoadType.None &&
          this.bottom == RoadType.None
        let curveLeft =
          this.left == RoadType.Train &&
          this.right == RoadType.None &&
          this.bottom == RoadType.None
        return {
          curve: curveLeft || curveRight,
          mirrorX: curveRight,
          mirrorY: false
        }
      case RoadSide.Right:
        let curveTop =
          this.top == RoadType.Train &&
          this.bottom == RoadType.None &&
          this.left == RoadType.None
        let curveBottom =
          this.bottom == RoadType.Train &&
          this.top == RoadType.None &&
          this.left == RoadType.None
        return {
          curve: curveTop || curveBottom,
          mirrorX: true,
          mirrorY: curveBottom
        }
      case RoadSide.Bottom:
        curveRight =
          this.right == RoadType.Train &&
          this.left == RoadType.None &&
          this.top == RoadType.None
        curveLeft =
          this.left == RoadType.Train &&
          this.right == RoadType.None &&
          this.top == RoadType.None
        return {
          curve: curveLeft || curveRight,
          mirrorX: curveRight,
          mirrorY: true
        }
      case RoadSide.Left:
        curveTop =
          this.top == RoadType.Train &&
          this.bottom == RoadType.None &&
          this.right == RoadType.None
        curveBottom =
          this.bottom == RoadType.Train &&
          this.top == RoadType.None &&
          this.right == RoadType.None
        return {
          curve: curveTop || curveBottom,
          mirrorX: false,
          mirrorY: curveBottom
        }
    }
  }

  private isAdjacentSideCarRoad = (side: RoadSide): boolean => {
    switch (side) {
      case (RoadSide.Top, RoadSide.Bottom):
        return this.left == RoadType.Car || this.right == RoadType.Car
      default:
        return this.top == RoadType.Car || this.bottom == RoadType.Car
    }
  }

  private shouldDrawOuterArcForCarRoad = (
    adjacentType: RoadType,
    oppositeType: RoadType, // the type of road opposite the side being drawn
    oppositeAdjacentType: RoadType // the type of road opposite the adjacent side
  ): boolean => {
    return (
      adjacentType == RoadType.None &&
      oppositeType == RoadType.None &&
      oppositeAdjacentType == RoadType.Car
    )
  }
}

enum RoadAxis {
  LeftRight,
  TopBottom
}

export { TileModel, RoadType }

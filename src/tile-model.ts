enum RoadType {
  None,
  Car,
  Train
}

enum RoadAxis {
  LeftRight,
  TopBottom
}

class TileModel {
  top: RoadType
  right: RoadType
  bottom: RoadType
  left: RoadType
  blocked: boolean

  constructor(top: RoadType, right: RoadType, bottom: RoadType, left: RoadType, blocked: boolean) {
    this.top = top
    this.right = right
    this.bottom = bottom
    this.left = left
    this.blocked = blocked
  }

  rotate = (counterclockwise?: boolean) => {
    const counter = counterclockwise || false
    const oldTop = this.top
    if (counter) {
      this.top = this.right
      this.right = this.bottom
      this.bottom = this.left
      this.left = oldTop
    } else {
      this.top = this.left
      this.left = this.bottom
      this.bottom = this.right
      this.right = oldTop
    }
  }

  mirror = (axis: RoadAxis) => {
    if (axis == RoadAxis.LeftRight) {
      const oldRight = this.right
      this.right = this.left
      this.left = oldRight
    } else {
      const oldTop = this.top
      this.top = this.bottom
      this.bottom = oldTop
    }
  }

  anyRoadsAreCars = (): boolean => {
    return (
      this.top == RoadType.Car || this.right == RoadType.Car || this.bottom == RoadType.Car || this.left == RoadType.Car
    )
  }
}

export { TileModel, RoadType, RoadAxis }

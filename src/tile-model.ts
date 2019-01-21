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
}

export { TileModel, RoadType }

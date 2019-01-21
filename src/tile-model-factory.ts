import { TileModel, RoadType } from './tile-display'

const makeTileModel = (id: number): TileModel => {
  switch (id) {
    case 0:
      return new TileModel(
        RoadType.Car,
        RoadType.Car,
        RoadType.Train,
        RoadType.Car,
        true
      )
    case 1:
      return new TileModel(
        RoadType.Car,
        RoadType.Train,
        RoadType.Train,
        RoadType.Train,
        true
      )
    case 2:
      return new TileModel(
        RoadType.Car,
        RoadType.Car,
        RoadType.Car,
        RoadType.Car,
        false
      )
    case 3:
      return new TileModel(
        RoadType.Train,
        RoadType.Train,
        RoadType.Train,
        RoadType.Train,
        false
      )
    case 4:
      return new TileModel(
        RoadType.Car,
        RoadType.Train,
        RoadType.Train,
        RoadType.Car,
        true
      )
    case 5:
      return new TileModel(
        RoadType.Car,
        RoadType.Train,
        RoadType.Car,
        RoadType.Train,
        true
      )
    case 6:
      return new TileModel(
        RoadType.Train,
        RoadType.None,
        RoadType.None,
        RoadType.Train,
        false
      )
    case 7:
      return new TileModel(
        RoadType.Train,
        RoadType.Train,
        RoadType.None,
        RoadType.Train,
        false
      )
    case 8:
      return new TileModel(
        RoadType.Train,
        RoadType.None,
        RoadType.Train,
        RoadType.None,
        false
      )
    case 9:
      return new TileModel(
        RoadType.Car,
        RoadType.None,
        RoadType.None,
        RoadType.Car,
        false
      )
    case 10:
      return new TileModel(
        RoadType.Car,
        RoadType.Car,
        RoadType.None,
        RoadType.Car,
        false
      )
    case 11:
      return new TileModel(
        RoadType.Car,
        RoadType.None,
        RoadType.Car,
        RoadType.None,
        false
      )
    case 12:
      return new TileModel(
        RoadType.Car,
        RoadType.Train,
        RoadType.Car,
        RoadType.Train,
        false
      )
    case 13:
      return new TileModel(
        RoadType.Train,
        RoadType.None,
        RoadType.Car,
        RoadType.None,
        true
      )
    case 14:
      return new TileModel(
        RoadType.Train,
        RoadType.None,
        RoadType.None,
        RoadType.Car,
        true
      )
    default:
      return new TileModel(
        RoadType.None,
        RoadType.None,
        RoadType.None,
        RoadType.None,
        false
      )
  }
}

export default makeTileModel

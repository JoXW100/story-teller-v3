import AreaNone from './none'
import AreaLine from './line'
import AreaCone from './cone'
import AreaSquare from './square'
import AreaRectangle from './rectangle'
import AreaCube from './cube'
import AreaCuboid from './cuboid'
import AreaSphere from './sphere'
import AreaCylinder from './cylinder'
import { hasObjectProperties, simplifyObjectProperties, validateObjectProperties } from '..'
import { isEnum, isRecord } from 'utils'
import { AreaType } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'
import type { IArea } from 'types/database/area'

export type Area = AreaNone | AreaLine | AreaCone | AreaSquare | AreaRectangle |
AreaCube | AreaCuboid | AreaSphere | AreaCylinder

const AreaFactory: IDatabaseFactory<IArea, Area> = {
    create: function (data: Simplify<IArea> = {}): Area {
        switch (data.type) {
            case AreaType.Line:
                return new AreaLine(data)
            case AreaType.Cone:
                return new AreaCone(data)
            case AreaType.Square:
                return new AreaSquare(data)
            case AreaType.Rectangle:
                return new AreaRectangle(data)
            case AreaType.Cube:
                return new AreaCube(data)
            case AreaType.Cuboid:
                return new AreaCuboid(data)
            case AreaType.Sphere:
                return new AreaSphere(data)
            case AreaType.Cylinder:
                return new AreaCylinder(data)
            default:
                return new AreaNone(data as Record<string, unknown>)
        }
    },
    is: function (data: unknown): data is IArea {
        return AreaFactory.validate(data) && hasObjectProperties(data, AreaFactory.properties(data))
    },
    validate: function (data: unknown): data is Simplify<IArea> {
        return isRecord(data) && validateObjectProperties(data, AreaFactory.properties(data))
    },
    simplify: function (data: IArea): Simplify<IArea> {
        return simplifyObjectProperties(data, AreaFactory.properties(data))
    },
    properties: function (data: unknown): DataPropertyMap<IArea, Area> {
        const type = isRecord(data) && isEnum(data.type, AreaType)
            ? data.type
            : AreaType.None
        switch (type) {
            case AreaType.None:
                return AreaNone.properties
            case AreaType.Line:
                return AreaLine.properties
            case AreaType.Cone:
                return AreaCone.properties
            case AreaType.Square:
                return AreaSquare.properties
            case AreaType.Cube:
                return AreaCube.properties
            case AreaType.Rectangle:
                return AreaRectangle.properties
            case AreaType.Cuboid:
                return AreaCuboid.properties
            case AreaType.Sphere:
                return AreaSphere.properties
            case AreaType.Cylinder:
                return AreaCylinder.properties
        }
    }
}

export default AreaFactory

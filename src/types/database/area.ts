import type { AreaType } from 'structure/dnd'

export interface IAreaBase {
}

export interface IAreaNone extends IAreaBase {
    readonly type: AreaType.None
}

export interface IAreaLine extends IAreaBase {
    readonly type: AreaType.Line
    readonly length: number
}

export interface IAreaCone extends IAreaBase {
    readonly type: AreaType.Cone
    readonly side: number
}

export interface IAreaSquare extends IAreaBase {
    readonly type: AreaType.Square
    readonly side: number
}

export interface IAreaRectangle extends IAreaBase {
    readonly type: AreaType.Rectangle
    readonly length: number
    readonly width: number
}

export interface IAreaCube extends IAreaBase {
    readonly type: AreaType.Cube
    readonly side: number
}

export interface IAreaCuboid extends IAreaBase {
    readonly type: AreaType.Cuboid
    readonly length: number
    readonly width: number
    readonly height: number
}

export interface IAreaSphere extends IAreaBase {
    readonly type: AreaType.Sphere
    readonly radius: number
}

export interface IAreaCylinder extends IAreaBase {
    readonly type: AreaType.Cylinder
    readonly radius: number
    readonly height: number
}

export type IArea = IAreaNone | IAreaLine | IAreaCone | IAreaSquare |
IAreaCube | IAreaRectangle | IAreaCuboid | IAreaSphere | IAreaCylinder

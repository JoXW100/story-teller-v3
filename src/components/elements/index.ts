import { keysOf } from 'utils'
import * as Align from './align'
import * as Block from './block'
import * as Bold from './bold'
import * as Box from './box'
import * as Center from './center'
import * as Fill from './fill'
import * as Header from './header'
import * as Icon from './icon'
import * as Image from './image'
import * as Item from './item'
import * as Line from './line'
import * as Link from './link'
import * as LinkContent from './linkContent'
import * as LinkTitle from './linkTitle'
import * as Margin from './margin'
import * as Newline from './newline'
import * as Roll from './roll'
import * as Row from './row'
import * as Save from './save'
import * as SetElement from './set'
import * as Space from './space'
import * as Table from './table'
import * as TableCell from './tableCell'
import * as TableHeader from './tableHeader'
import * as Text from './text'
import * as Variable from './variable'
import type { IElement } from 'structure/elements'
import type { ElementDefinitions } from 'structure/elements/dictionary'

export const TableElementTypes = new Set([...Object.keys(TableCell.element), ...Object.keys(TableHeader.element)])

export const ElementDictionary: ElementDefinitions = {
    ...Align.element,
    ...Block.element,
    ...Bold.element,
    ...Box.element,
    ...Center.element,
    ...Fill.element,
    ...Header.element,
    ...Icon.element,
    ...Image.element,
    ...Item.element,
    ...Line.element,
    ...Link.element,
    ...LinkContent.element,
    ...LinkTitle.element,
    ...Margin.element,
    ...Newline.element,
    ...Roll.element,
    ...Row.element,
    ...Save.element,
    ...SetElement.element,
    ...Space.element,
    ...Table.element,
    ...TableCell.element,
    ...TableHeader.element,
    ...Text.element,
    ...Variable.element
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ElementsType = { [K in keyof typeof ElementDictionary]: Exclude<typeof ElementDictionary[K]['element'], undefined> }
const Elements = keysOf(ElementDictionary).reduce<Partial<ElementsType>>((prev, key) => (
    { ...prev, [key]: ElementDictionary[key].element }
), {}) as ElementsType

type ExtractElementType<T> = T extends keyof typeof ElementDictionary
    ? typeof ElementDictionary[T]
    : IElement

export function getElement<T extends string> (key: T): ExtractElementType<T>
export function getElement<T extends keyof typeof ElementDictionary> (key: T): ExtractElementType<T> | null {
    return ElementDictionary[key] as ExtractElementType<T> ?? null
}

export default Elements

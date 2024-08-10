import type { IElement } from '.'
import AlignElement from './align'
import BlockElement from './block'
import BoldElement from './bold'
import BoxElement from './box'
import CenterElement from './center'
import FillElement from './fill'
import HeaderElement from './header'
import IconElement from './icon'
import ImageElement from './image'
import ItemElement from './item'
import LineElement from './line'
import LinkElement from './link'
import MarginElement from './margin'
import NewLineElement from './newline'
import RollElement from './roll'
import RowElement from './row'
import SaveElement from './save'
import SetElement from './set'
import SpaceElement from './space'
import TableElement from './table'
import TableCellElement from './tableCell'
import TableHeaderElement from './tableHeader'
import TextElement from './text'
import LinkContentElement from './linkContent'
import LinkTitleElement from './linkTitle'
import VariableElement from './variable'

const bold = new BoldElement()
const header = new HeaderElement()
const newline = new NewLineElement()
const save = new SaveElement()
const tableCell = new TableCellElement()
const tableHeader = new TableHeaderElement()

export const ElementDefinitionDictionary = {
    'align': new AlignElement(),
    'block': new BlockElement(),
    'bold': bold,
    'b': bold,
    'box': new BoxElement(),
    'center': new CenterElement(),
    'fill': new FillElement(),
    'h1': header,
    'h2': header,
    'h3': header,
    'h4': header,
    'icon': new IconElement(),
    'image': new ImageElement(),
    'item': new ItemElement(),
    'line': new LineElement(),
    'link': new LinkElement(),
    'linkContent': new LinkContentElement(),
    'linkTitle': new LinkTitleElement(),
    'margin': new MarginElement(),
    'newline': newline,
    'n': newline,
    'roll': new RollElement(),
    'row': new RowElement(),
    'save': save,
    'check': save,
    'set': new SetElement(),
    'space': new SpaceElement(),
    'table': new TableElement(),
    'tableCell': tableCell,
    'tc': tableCell,
    'tableHeader': tableHeader,
    'th': tableHeader,
    'text': new TextElement(),
    'var': new VariableElement()
} satisfies Record<string, IElement<any>>

export type ElementDefinitions = typeof ElementDefinitionDictionary

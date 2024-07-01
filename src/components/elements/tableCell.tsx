import { useMemo, type CSSProperties } from 'react'
import TableCellElement, { type TableCellElementParams } from 'structure/elements/tableCell'

const TableCellComponent: React.FC<TableCellElementParams> = ({ children, color }) => {
    const style: CSSProperties = useMemo(() => {
        const properties: CSSProperties = {}
        if (color !== null) {
            properties.background = color
        }
        return properties
    }, [color])
    return (
        <td style={style}>
            {children}
        </td>
    )
}

const tableCell = new TableCellElement(({ key, ...props }) => <TableCellComponent key={key} {...props}/>)

export const element = {
    'tableCell': tableCell,
    'tc': tableCell
}

export default TableCellComponent

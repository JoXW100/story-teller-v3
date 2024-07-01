import { useMemo, type CSSProperties } from 'react'
import TableHeaderElement, { type TableHeaderElementParams } from 'structure/elements/tableHeader'

const TableHeaderComponent: React.FC<TableHeaderElementParams> = ({ children, color, width }) => {
    const style: CSSProperties = useMemo(() => {
        const properties: CSSProperties = {}
        if (width !== null) {
            properties.width = width
            properties.maxWidth = width
        }
        if (color !== null) {
            properties.background = color
        }
        return properties
    }, [color, width])
    return (
        <th style={style}>
            {children}
        </th>
    )
}

const tableHeader = new TableHeaderElement(({ key, ...props }) => <TableHeaderComponent key={key} {...props}/>)

export const element = {
    'tableHeader': tableHeader,
    'th': tableHeader
}

export default TableHeaderComponent

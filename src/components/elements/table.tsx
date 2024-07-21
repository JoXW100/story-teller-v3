import { useMemo, type CSSProperties } from 'react'
import TableElement, { type TableElementParams } from 'structure/elements/table'
import styles from './styles.module.scss'

const TableComponent: React.FC<TableElementParams> = ({ th = [], tc = [], color, border, weight, width }) => {
    const style = useMemo<CSSProperties>(() => {
        const properties: React.CSSProperties = {}
        if (weight !== undefined && weight !== null) {
            properties.flex = weight
        }
        if (width !== undefined && width !== null) {
            properties.width = width
            properties.maxWidth = width
        }
        if (color !== undefined && color !== null) {
            properties.background = color
        }
        return properties
    }, [color, weight, width])

    if (th.length === 0) {
        return null
    }

    const rows = Math.floor(tc.length / th.length)
    const content = new Array<React.ReactNode[]>(rows)
    let row = 0
    let column = 0
    for (let i = 0; i < tc.length; i++) {
        if (!Array.isArray(content[row])) {
            content[row] = []
        }
        content[row][column] = tc[i]
        if (++column >= th.length) {
            ++row
            column = 0
        }
    }

    return (
        <table
            className={styles.table}
            data={String(border)}
            style={style}>
            <thead>
                <tr>{th}</tr>
            </thead>
            <tbody>
                { content.map((row, key) => (
                    <tr key={key}>{row}</tr>
                ))}
            </tbody>
        </table>
    )
}

export const element = {
    'table': new TableElement(({ key, ...props }) => <TableComponent key={key} {...props}/>)
}

export default TableComponent

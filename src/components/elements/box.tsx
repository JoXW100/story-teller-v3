import { useMemo, type CSSProperties } from 'react'
import BoxElement, { type BoxElementParams } from 'structure/elements/box'
import styles from './styles.module.scss'

const BoxComponent: React.FC<BoxElementParams> = ({ children, color, border, weight, width }) => {
    const style = useMemo<CSSProperties>(() => {
        const properties: CSSProperties = {}
        if (weight !== null) {
            properties.flex = weight
        }
        if (width !== null) {
            properties.width = width
            properties.maxWidth = width
        }
        if (color !== null) {
            properties.background = color
        }
        return properties
    }, [color, weight, width])

    return (
        <div
            className={styles.box}
            data={String(border)}
            style={style}>
            { children }
        </div>
    )
}

export const element = {
    'box': new BoxElement(({ key, ...props }) => <BoxComponent key={key} {...props}/>)
}

export default BoxComponent

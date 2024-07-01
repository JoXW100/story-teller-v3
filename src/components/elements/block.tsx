import { useMemo, type CSSProperties } from 'react'
import BlockElement, { type BlockElementParams } from 'structure/elements/block'
import styles from './styles.module.scss'

const BlockComponent: React.FC<BlockElementParams> = ({ children, weight, width }) => {
    const style = useMemo<CSSProperties>(() => {
        const properties: React.CSSProperties = {}
        if (weight !== null) {
            properties.flex = weight
        }
        if (width !== null) {
            properties.width = width
            properties.maxWidth = width
        }
        return properties
    }, [weight, width])

    return (
        <div
            className={styles.block}
            style={style}>
            { children }
        </div>
    )
}

export const element = {
    'block': new BlockElement(({ key, ...props }) => <BlockComponent key={key} {...props}/>)
}

export default BlockComponent

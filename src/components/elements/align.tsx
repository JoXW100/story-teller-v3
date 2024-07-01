import React, { useMemo, type CSSProperties } from 'react'
import AlignElement, { type AlignElementParams } from 'structure/elements/align'
import styles from './styles.module.scss'

const AlignComponent: React.FC<AlignElementParams> = ({ children, direction, weight, width }) => {
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
            className={styles.align}
            style={style}
            data={direction}>
            { children }
        </div>
    )
}

export const element = {
    'align': new AlignElement(({ key, ...props }) => <AlignComponent key={key} {...props}/>)
}

export default AlignComponent

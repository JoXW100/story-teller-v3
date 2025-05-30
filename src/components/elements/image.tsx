import { useMemo, type CSSProperties } from 'react'
import ImageWithDefault from 'components/controls/image'
import ImageElement, { type ImageElementParams } from 'structure/elements/image'
import { asBooleanString } from 'utils'
import styles from './styles.module.scss'

const ImageComponent: React.FC<ImageElementParams> = ({ href = '', border, weight, width }) => {
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
            className={styles.image}
            style={style}
            data={asBooleanString(border)}>
            <ImageWithDefault href={href}/>
        </div>
    )
}

export const element = {
    'image': new ImageElement(({ key, ...props }) => <ImageComponent key={key} {...props}/>)
}

export default ImageComponent

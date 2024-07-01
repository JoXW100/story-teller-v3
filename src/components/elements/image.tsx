import { useMemo, type CSSProperties } from 'react'
import ImageElement, { type ImageElementParams } from 'structure/elements/image'
import styles from './styles.module.scss'

const ImageComponent: React.FC<ImageElementParams> = ({ href, border, weight, width }) => {
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
            data={String(border)}>
            <img src={href.length > 0 ? href : '/defaultImage.jpg'} alt='Missing image'/>
        </div>
    )
}

export const element = {
    'image': new ImageElement(({ key, ...props }) => <ImageComponent key={key} {...props}/>)
}

export default ImageComponent

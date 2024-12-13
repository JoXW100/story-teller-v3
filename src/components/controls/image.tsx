import { useEffect, useState, type CSSProperties } from 'react'

type ImageParams = React.PropsWithRef<{
    href?: string
    style?: CSSProperties
    className?: string
}>

export const DefaultImageHref = '/defaultImage.jpg'

const ImageWithDefault: React.FC<ImageParams> = ({ href, style, className }) => {
    const [usedHref, setHref] = useState<string | undefined>(href)

    useEffect(() => {
        setHref(current => href !== current ? href : current)
    }, [href])

    return (
        <image
            href={usedHref ?? DefaultImageHref}
            style={style}
            className={className}
            onError={() => { setHref(DefaultImageHref) }}/>
    )
}

export default ImageWithDefault

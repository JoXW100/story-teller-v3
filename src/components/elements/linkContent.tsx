import Link from 'next/link'
import Loading from 'components/loading'
import LocalizedText from 'components/localizedText'
import { DocumentRendererMap } from 'components/layouts/fileView/renderer'
import { isKeyOf, keysOf } from 'utils'
import Navigation from 'utils/navigation'
import { useFileOfType } from 'utils/hooks/files'
import LinkContentElement, { type LinkContentElementParams } from 'structure/elements/linkContent'
import type { ObjectId } from 'types'
import styles from './styles.module.scss'

const AllowedTypes = keysOf(DocumentRendererMap)
const LinkContentComponent: React.FC<LinkContentElementParams> = ({ fileId, border, newTab }) => {
    const [file, loading] = useFileOfType(fileId, AllowedTypes)
    const rel = newTab ? 'noopener noreferrer' : undefined
    const target = newTab ? '_blank' : undefined

    if (file === null) {
        return <LocalizedText className={styles.error} id='common-error'/>
    }

    const Renderer: React.FC<{ id: ObjectId, data: any }> = isKeyOf(file.type, DocumentRendererMap)
        ? DocumentRendererMap[file.type].link
        : () => null

    return (
        <Loading loaded={!loading}>
            <Link href={Navigation.fileURL(file.id, file.storyId)} className={styles.linkContent} target={target} rel={rel} passHref>
                <div data={String(border)}>
                    <Renderer id={file.id} data={file.data}/>
                </div>
            </Link>
        </Loading>
    )
}

export const element = {
    'linkContent': new LinkContentElement(({ key, ...props }) => <LinkContentComponent key={key} {...props}/>)
}

export default LinkContentComponent

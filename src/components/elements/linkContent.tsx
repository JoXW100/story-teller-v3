import Link from 'next/link'
import Loading from 'components/controls/loading'
import LocalizedText from 'components/controls/localizedText'
import { LinkRenderer } from 'components/views/renderer/utils'
import Navigation from 'utils/navigation'
import { useFile } from 'utils/hooks/files'
import LinkContentElement, { type LinkContentElementParams } from 'structure/elements/linkContent'
import styles from './styles.module.scss'

const LinkContentComponent: React.FC<LinkContentElementParams> = ({ fileId, border, newTab }) => {
    const [file, loading] = useFile(fileId)
    const rel = newTab ? 'noopener noreferrer' : undefined
    const target = newTab ? '_blank' : undefined

    return file !== null
        ? <Loading loaded={!loading}>
            <Link href={Navigation.fileURL(file.id, file.storyId)} className={styles.linkContent} target={target} rel={rel} passHref>
                <div data={String(border)}>
                    <LinkRenderer file={file}/>
                </div>
            </Link>
        </Loading>
        : <LocalizedText className={styles.error} id='common-error'/>
}

export const element = {
    'linkContent': new LinkContentElement(({ key, ...props }) => <LinkContentComponent key={key} {...props}/>)
}

export default LinkContentComponent

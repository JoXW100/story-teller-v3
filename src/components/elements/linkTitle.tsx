import Link from 'next/link'
import LocalizedText from 'components/controls/localizedText'
import { useFile } from 'utils/hooks/files'
import Navigation from 'utils/navigation'
import LinkTitleElement, { type LinkTitleElementParams } from 'structure/elements/linkTitle'
import styles from './styles.module.scss'

const LinkTitleComponent: React.FC<LinkTitleElementParams> = ({ fileId, newTab }) => {
    const [file] = useFile(fileId)
    const rel = newTab ? 'noopener noreferrer' : undefined
    const target = newTab ? '_blank' : undefined

    return file !== null
        ? <Link href={Navigation.filePath(fileId, file.storyId)} className={styles.linkTitle} target={target} rel={rel} passHref>
            { file.getTitle() }
        </Link>
        : <LocalizedText className={styles.error} id='common-error'/>
}

export const element = {
    'linkTitle': new LinkTitleElement(({ key, ...props }) => <LinkTitleComponent key={key} {...props}/>)
}

export default LinkTitleComponent

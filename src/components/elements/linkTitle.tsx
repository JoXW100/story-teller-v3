import { useContext } from 'react'
import Link from 'next/link'
import { Context } from 'components/contexts/story'
import LocalizedText from 'components/localizedText'
import { useFile } from 'utils/hooks/files'
import Navigation from 'utils/navigation'
import LinkTitleElement, { type LinkTitleElementParams } from 'structure/elements/linkTitle'
import styles from './styles.module.scss'

const LinkTitleComponent: React.FC<LinkTitleElementParams> = ({ fileId, newTab }) => {
    const [context] = useContext(Context)
    const [file] = useFile(fileId)
    const href = Navigation.filePath(fileId, context.story.id)
    const rel = newTab ? 'noopener noreferrer' : undefined
    const target = newTab ? '_blank' : undefined

    return file !== null
        ? (
            <Link href={href} className={styles.linkTitle} target={target} rel={rel} passHref>
                { file.getTitle() }
            </Link>
        )
        : <LocalizedText className={styles.error} id='common-error'/>
}

export const element = {
    'linkTitle': new LinkTitleElement(({ key, ...props }) => <LinkTitleComponent key={key} {...props}/>)
}

export default LinkTitleComponent

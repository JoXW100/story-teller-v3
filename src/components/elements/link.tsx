import Link from 'next/link'
import LinkElement, { type LinkElementParams } from 'structure/elements/link'
import styles from './styles.module.scss'

const LinkComponent: React.FC<LinkElementParams> = ({ children, href, newTab }) => {
    const rel = newTab ? 'noopener noreferrer' : undefined
    const target = newTab ? '_blank' : undefined
    return (
        <Link className={styles.link} href={href} target={target} rel={rel} passHref>
            { children }
        </Link>
    )
}

export const element = {
    'link': new LinkElement(({ key, ...props }) => <LinkComponent key={key} {...props}/>)
}

export default LinkComponent

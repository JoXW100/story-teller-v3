import { useRouter } from 'next/router'
import styles from './style.module.scss'

type EmptyCardProps = React.PropsWithChildren<{
    header: React.ReactNode
    href: URL
}>

const EmptyCard: React.FC<EmptyCardProps> = ({ header, href, children }) => {
    const router = useRouter()
    const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
        void router.push(href)
    }

    return (
        <div className={styles.card} onClick={handleClick}>
            <div className={styles.label}>
                { header }
            </div>
            { children }
        </div>
    )
}

export default EmptyCard

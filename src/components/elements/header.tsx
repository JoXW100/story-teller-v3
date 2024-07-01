import HeaderElement, { type HeaderElementParams } from 'structure/elements/header'
import styles from './styles.module.scss'

export const Header1Component: React.FC<HeaderElementParams> = ({ children, underline }) => {
    return (
        <div className={styles.header1} data={String(underline)}>
            { children }
        </div>
    )
}

export const Header2Component: React.FC<HeaderElementParams> = ({ children, underline }) => {
    return (
        <div className={styles.header2} data={String(underline)}>
            { children }
        </div>
    )
}

export const Header3Component: React.FC<HeaderElementParams> = ({ children, underline }) => {
    return (
        <div className={styles.header3} data={String(underline)}>
            { children }
        </div>
    )
}

export const element = {
    'h1': new HeaderElement(({ key, ...props }) => <Header1Component key={key} {...props}/>),
    'h2': new HeaderElement(({ key, ...props }) => <Header2Component key={key} {...props}/>),
    'h3': new HeaderElement(({ key, ...props }) => <Header3Component key={key} {...props}/>)
}

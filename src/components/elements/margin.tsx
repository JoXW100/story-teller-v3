import MarginElement, { type MarginElementParams } from 'structure/elements/margin'
import styles from './styles.module.scss'

const MarginComponent: React.FC<MarginElementParams> = ({ children, margin }) => {
    return (
        <div className={styles.margin} style={{ margin: margin }}>
            { children }
        </div>
    )
}

export const element = {
    'margin': new MarginElement(({ key, ...props }) => <MarginComponent key={key} {...props}/>)
}

export default MarginComponent

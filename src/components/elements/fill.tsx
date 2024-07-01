import FillElement, { type FillElementParams } from 'structure/elements/fill'
import styles from './styles.module.scss'

const FillComponent: React.FC<FillElementParams> = ({ children }) => {
    return (
        <div className={styles.center}>
            { children }
        </div>
    )
}

export const element = {
    'fill': new FillElement(({ key, ...props }) => <FillComponent key={key} {...props}/>)
}

export default FillComponent

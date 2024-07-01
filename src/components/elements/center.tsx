import CenterElement, { type CenterElementParams } from 'structure/elements/center'
import styles from './styles.module.scss'

const CenterComponent: React.FC<CenterElementParams> = ({ children }) => {
    return (
        <div className={styles.center}>
            { children }
        </div>
    )
}

export const element = {
    'center': new CenterElement(({ key, ...props }) => <CenterComponent key={key} {...props}/>)
}

export default CenterComponent

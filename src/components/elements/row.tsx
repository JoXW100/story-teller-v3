import RowElement, { type RowElementParams } from 'structure/elements/row'
import styles from './styles.module.scss'

const RowComponent: React.FC<RowElementParams> = ({ children }) => {
    return (
        <div className={styles.row}>
            { children }
        </div>
    )
}

export const element = {
    'row': new RowElement(({ key, ...props }) => <RowComponent key={key} {...props}/>)
}

export default RowComponent

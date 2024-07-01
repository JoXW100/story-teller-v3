import ItemElement, { type ItemElementParams } from 'structure/elements/item'
import styles from './styles.module.scss'

const ItemComponent: React.FC<ItemElementParams> = ({ children, dot }) => {
    return (
        <div className={styles.item} data={dot}>
            {children}
        </div>
    )
}

export const element = {
    'item': new ItemElement(({ key, ...props }) => <ItemComponent key={key} {...props}/>)
}

export default ItemComponent

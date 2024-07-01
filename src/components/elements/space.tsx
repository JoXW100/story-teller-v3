import SpaceElement from 'structure/elements/space'
import styles from './styles.module.scss'

const SpaceComponent: React.FC = () => {
    return <div className={styles.space}/>
}

export const element = {
    'space': new SpaceElement(({ key, ...props }) => <SpaceComponent key={key} {...props}/>)
}

export default SpaceComponent

import LineElement, { type LineElementParams } from 'structure/elements/line'
import styles from './styles.module.scss'

const LineComponent: React.FC<LineElementParams> = ({ width }) => {
    return (
        <div className={styles.line} style={{ borderWidth: width }}/>
    )
}

export const element = {
    'line': new LineElement(({ key, ...props }) => <LineComponent key={key} {...props}/>)
}

export default LineComponent

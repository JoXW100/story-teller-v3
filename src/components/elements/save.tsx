import { Tooltip } from '@mui/material'
import SaveElement, { type SaveElementParams } from 'structure/elements/save'
import styles from './styles.module.scss'

const SaveComponent: React.FC<SaveElementParams> = ({ value, type, tooltips }) => {
    const content = (
        <span className={styles.save}>
            {`DC:${value}${type !== null ? ` ${type.toLocaleUpperCase()}` : ''}`}
        </span>
    )

    return tooltips === null
        ? content
        : <Tooltip title={tooltips}>
            { content }
        </Tooltip>
}

const save = new SaveElement(({ key, ...props }) => <SaveComponent key={key} {...props}/>)

export const element = {
    'save': save,
    'check': save
}

export default SaveComponent

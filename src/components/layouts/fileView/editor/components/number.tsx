import { useContext } from 'react'
import GroupItemComponent from './groupItem'
import { Context, getRelativeFieldObject } from 'components/contexts/file'
import NumberInput from 'components/layouts/numericInput'
import { isRecord } from 'utils'
import Logger from 'utils/logger'
import type { LanguageKey } from 'data'
import styles from '../style.module.scss'

type NumberComponentParams = React.PropsWithoutRef<{
    field: string
    labelId: LanguageKey
    labelArgs?: any[]
    allowDecimal?: boolean
    allowNegative?: boolean
    deps?: string[]
}>

const NumberComponent: React.FC<NumberComponentParams> = ({ field, labelId, labelArgs, allowDecimal = false, allowNegative = false, deps = [] }) => {
    const [context, dispatch] = useContext(Context)
    if (!isRecord(context.file.data)) {
        Logger.throw('Editor.NumberComponent', 'Data of incorrect type', context.file.data)
        return null
    }

    const relative = getRelativeFieldObject(field, context.file.data)
    if (relative === null) {
        Logger.throw('Editor.NumberComponent', 'Failed to get relative field', field)
        return null
    }

    const value = relative.relative[relative.key]
    if (typeof value !== 'number') {
        Logger.throw('Editor.NumberComponent', 'Relative field not of expected type', field, value)
        return null
    }

    const handleChange = (value: number): void => {
        dispatch.setData(field, value, deps)
    }

    return (
        <GroupItemComponent className={styles.editGroupItem} labelId={labelId} labelArgs={labelArgs}>
            <NumberInput
                className={styles.editInput}
                value={value}
                allowDecimal={allowDecimal}
                allowNegative={allowNegative}
                onChange={handleChange}/>
        </GroupItemComponent>
    )
}
export default NumberComponent

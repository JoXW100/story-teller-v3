import React, { useContext } from 'react'
import GroupItemComponent from './groupItem'
import { Context } from 'components/contexts/file'
import DropdownMenu from 'components/controls/dropdownMenu'
import NumberInput from 'components/controls/numericInput'
import type { LanguageKey } from 'assets'
import { getRelativeFieldObject, isCalcValue, isRecord } from 'utils'
import Logger from 'utils/logger'
import { useLocalizedEnums } from 'utils/hooks/localization'
import { CalcMode } from 'structure/database'
import styles from '../style.module.scss'

type CalcComponentParams = React.PropsWithChildren<{
    field: string
    labelId: LanguageKey
    labelArgs?: any[]
}>

const CalcComponent: React.FC<CalcComponentParams> = ({ field, labelId, labelArgs }) => {
    const [context, dispatch] = useContext(Context)
    const options = useLocalizedEnums('calc')

    if (!isRecord(context.file.data)) {
        Logger.throw('Editor.NumberComponent', 'Data of incorrect type', context.file.data)
        return null
    }

    const relative = getRelativeFieldObject(field, context.file.data)
    if (relative === null) {
        Logger.throw('Editor.OptionComponent', 'Failed to get relative field', field)
        return null
    }

    const value = relative.relative[relative.key]
    if (!isCalcValue(value)) {
        Logger.throw('Editor.OptionComponent', 'Relative field not of expected type', field, value)
        return null
    }

    const handleModeChange = (newMode: CalcMode): void => {
        dispatch.setData(field, { ...value, mode: newMode })
    }

    const handleNumericInput = (newValue: number): void => {
        dispatch.setData(field, { ...value, value: newValue })
    }

    return (
        <GroupItemComponent className={styles.editOption} labelId={labelId} labelArgs={labelArgs}>
            <DropdownMenu
                className={styles.dropdown}
                values={options}
                value={value.mode}
                onChange={handleModeChange}/>
            <NumberInput
                onChange={handleNumericInput}
                value={value.mode === CalcMode.Auto ? 0 : value.value}
                disabled={value.mode === CalcMode.Auto}/>
        </GroupItemComponent>
    )
}
export default CalcComponent

import React, { useContext } from 'react'
import GroupItemComponent from './groupItem'
import { Context } from 'components/contexts/file'
import DropdownMenu from 'components/layouts/dropdownMenu'
import NumberInput from 'components/layouts/numericInput'
import { CalcMode, type ICalcValue } from 'structure/database'
import { getOptionType } from 'structure/optionData'
import { getRelativeFieldObject, isCalcValue, isRecord } from 'utils'
import type { LanguageKey } from 'data'
import Logger from 'utils/logger'
import styles from '../style.module.scss'

type CalcComponentParams = React.PropsWithChildren<{
    field: string
    labelId: LanguageKey
    labelArgs?: any[]
}>

const CalcComponent: React.FC<CalcComponentParams> = ({ field, labelId, labelArgs }) => {
    const [context, dispatch] = useContext(Context)
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
        dispatch.setData(field, { ...value, mode: newMode } satisfies ICalcValue)
    }

    const handleNumericInput = (newValue: number): void => {
        dispatch.setData(field, { ...value, value: newValue } satisfies ICalcValue)
    }

    return (
        <GroupItemComponent className={styles.editOption} labelId={labelId} labelArgs={labelArgs}>
            <DropdownMenu
                className={styles.dropdown}
                itemClassName={styles.dropdownItem}
                values={getOptionType('calc').options}
                value={value.mode}
                onChange={handleModeChange}/>
            <NumberInput
                onChange={handleNumericInput}
                value={value.value ?? 0}
                disabled={value.mode as CalcMode === CalcMode.Auto}/>
        </GroupItemComponent>
    )
}
export default CalcComponent

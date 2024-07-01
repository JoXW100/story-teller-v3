import React, { useContext, useMemo } from 'react'
import GroupItemComponent from './groupItem'
import { Context, getRelativeFieldObject } from 'components/contexts/file'
import SelectionMenu from 'components/layouts/menus/selection'
import { isEnum, isRecord, keysOf } from 'utils'
import Logger from 'utils/logger'
import type { LanguageKey } from 'data'
import { getOptionType } from 'structure/optionData'
import { isSourceBinding } from 'structure/database/files/creature/data'
import { AdvantageBinding } from 'structure/dnd'
import type { ISourceBinding } from 'types/database/files/creature'
import styles from '../style.module.scss'

type BindingInputComponentParams = React.PropsWithoutRef<{
    field: string
    labelId: LanguageKey
    labelArgs?: any[]
    deps?: string[]
}>

const BindingInputComponent: React.FC<BindingInputComponentParams> = ({ field, labelId, labelArgs, deps = [] }) => {
    const [context, dispatch] = useContext(Context)
    const textValue = useMemo(() => {
        if (!isRecord(context.file.data)) {
            Logger.throw('Editor.SelectionInputComponent', 'Data of incorrect type', context.file.data)
            return null
        }

        const relative = getRelativeFieldObject(field, context.file.data)
        if (relative === null) {
            Logger.throw('Editor.SelectionInputComponent', 'Failed to get relative field', field)
            return null
        }

        const value = relative.relative[relative.key] as Partial<Record<AdvantageBinding, ISourceBinding[]>>
        if (!isRecord(value, (key, value) => isEnum(key, AdvantageBinding) && Array.isArray(value) && value.every(isSourceBinding))) {
            Logger.throw('Editor.SelectionInputComponent', 'Relative field not of expected type', field, value)
            return null
        }

        const result: Record<string, string> = {}
        for (const key of keysOf(value)) {
            result[String(key)] = value[key]?.map(binding => binding.description).join(';') ?? ''
        }

        return result
    }, [field, context.file.data])

    if (textValue === null) {
        return null
    }

    const option = getOptionType('advantageBinding')

    const handleChange = (values: Record<string, string>): void => {
        const result: Record<string, ISourceBinding[]> = {}
        for (const key of keysOf(values)) {
            result[String(key)] = values[key]?.split(';').map(part => ({ source: null, description: part } satisfies ISourceBinding))
        }
        dispatch.setData(field, result, deps)
    }

    return (
        <GroupItemComponent className={styles.editList} labelId={labelId} labelArgs={labelArgs}>
            <SelectionMenu
                type='string'
                values={textValue}
                options={option.options}
                defaultValue=''
                componentClassName={styles.editSelectionItem}
                onChange={handleChange}/>
        </GroupItemComponent>
    )
}

export default BindingInputComponent

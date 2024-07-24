import React, { useContext, useMemo } from 'react'
import GroupItemComponent from './groupItem'
import { Context } from 'components/contexts/file'
import SelectionMenu from 'components/controls/menus/selection'
import { isEnum, isRecord, keysOf, getRelativeFieldObject, asBooleanString } from 'utils'
import Logger from 'utils/logger'
import { useLocalizedOptions } from 'utils/hooks/localization'
import type { LanguageKey } from 'assets'
import { isSourceBinding } from 'structure/database/files/creature/data'
import { AdvantageBinding } from 'structure/dnd'
import type { ISourceBinding } from 'types/database/files/creature'
import styles from '../style.module.scss'

type BindingInputComponentParams = React.PropsWithoutRef<{
    field: string
    labelId: LanguageKey
    labelArgs?: any[]
    fill?: boolean
}>

const BindingInputComponent: React.FC<BindingInputComponentParams> = ({ field, labelId, labelArgs, fill = false }) => {
    const [context, dispatch] = useContext(Context)
    const options = useLocalizedOptions('advantageBinding')

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

    const handleChange = (values: Record<string, string>): void => {
        const result: Record<string, ISourceBinding[]> = {}
        for (const key of keysOf(values)) {
            result[String(key)] = values[key]?.split(';').map(part => ({ source: null, description: part } satisfies ISourceBinding))
        }
        dispatch.setData(field, result)
    }

    return (
        <GroupItemComponent
            className={styles.editList}
            labelId={labelId}
            labelArgs={labelArgs}
            data={asBooleanString(fill)}>
            <SelectionMenu
                type='string'
                values={textValue}
                options={options}
                defaultValue=''
                componentClassName={styles.editSelectionItem}
                onChange={handleChange}/>
        </GroupItemComponent>
    )
}

export default BindingInputComponent
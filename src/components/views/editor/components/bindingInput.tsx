import React, { useContext } from 'react'
import GroupItemComponent from './groupItem'
import { Context } from 'components/contexts/file'
import SelectionMenu from 'components/controls/menus/selection'
import { isEnum, isRecord, keysOf, getRelativeFieldObject, asBooleanString } from 'utils'
import Logger from 'utils/logger'
import { useLocalizedEnums } from 'utils/hooks/localization'
import type { LanguageKey } from 'assets'
import { isSourceBinding } from 'structure/database/files/creature/data'
import { getEnumType, type EnumTypeKey } from 'structure/enums'
import type { ISourceBinding } from 'types/database/files/creature'
import styles from '../style.module.scss'

type BindingInputComponentParams = React.PropsWithoutRef<{
    field: string
    type: EnumTypeKey
    labelId: LanguageKey
    labelArgs?: any[]
    fill?: boolean
}>

const BindingInputComponent: React.FC<BindingInputComponentParams> = ({ field, type, labelId, labelArgs, fill = false }) => {
    const [context, dispatch] = useContext(Context)
    const options = useLocalizedEnums(type)

    if (!isRecord(context.file.data)) {
        Logger.throw('Editor.BindingInputComponent', 'Data of incorrect type', context.file.data)
        return null
    }

    const relative = getRelativeFieldObject(field, context.file.data)
    if (relative === null) {
        Logger.throw('Editor.BindingInputComponent', 'Failed to get relative field', field)
        return null
    }

    const value = relative.relative[relative.key]
    if (!isRecord<ISourceBinding[]>(value, (key, value) => isEnum(key, getEnumType(type).enum) && Array.isArray(value) && value.every(isSourceBinding))) {
        Logger.throw('Editor.BindingInputComponent', 'Relative field not of expected type', relative.relative, relative.key, value)
        return null
    }

    const textValue: Record<string, string> = {}
    for (const key of keysOf(value)) {
        textValue[String(key)] = value[key]?.map(binding => binding.description).join(';') ?? ''
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

import React, { useContext } from 'react'
import GroupItemComponent from './groupItem'
import { Context } from 'components/contexts/file'
import { type OptionTypeKey, getOptionType, type IOptionType } from 'structure/optionData'
import SelectionMenu from 'components/controls/menus/selection'
import { asBooleanString, isEnum, isNumber, isRecord, isString, getRelativeFieldObject } from 'utils'
import Logger from 'utils/logger'
import { useLocalizedOptions } from 'utils/hooks/localization'
import type { LanguageKey } from 'assets'
import type { Enum } from 'types'
import styles from '../style.module.scss'

type SelectionInputComponentParams = React.PropsWithoutRef<{
    field: string
    type: 'string' | 'number' | 'enum' | 'none'
    optionsType: OptionTypeKey
    editOptionsType?: OptionTypeKey
    labelId: LanguageKey
    labelArgs?: any[]
    fill?: boolean
}>

const SelectionInputComponent: React.FC<SelectionInputComponentParams> = ({ field, type, optionsType, editOptionsType, labelId, labelArgs, fill = false }) => {
    const [context, dispatch] = useContext(Context)
    const options = useLocalizedOptions(optionsType)
    const editOptions = useLocalizedOptions(editOptionsType)

    if (!isRecord(context.file.data)) {
        Logger.throw('Editor.SelectionInputComponent', 'Data of incorrect type', context.file.data)
        return null
    }

    const relative = getRelativeFieldObject(field, context.file.data)
    if (relative === null) {
        Logger.throw('Editor.SelectionInputComponent', 'Failed to get relative field', field)
        return null
    }

    const option = getOptionType(optionsType)
    if (option === null) {
        Logger.throw('Editor.SelectionInputComponent', 'No optionsType type of type: ' + optionsType)
        return null
    }

    let editOption: IOptionType<Enum> | null = null
    if (type === 'enum') {
        if (editOptionsType === undefined) {
            Logger.throw('Editor.SelectionInputComponent', 'No editOptionsTypes defined')
            return null
        }
        editOption = getOptionType(editOptionsType)
        if (editOption === null) {
            Logger.throw('Editor.SelectionInputComponent', 'No editOptionsType type of type: ' + editOptionsType)
            return null
        }
    }

    const value = relative.relative[relative.key]
    if ((type === 'string' && !isRecord(value, (key, val) => isEnum(key, option.enum) && isString(val))) ||
        (type === 'number' && !isRecord(value, (key, val) => isEnum(key, option.enum) && isNumber(val))) ||
        (type === 'enum' && (editOption === null || !isRecord(value, (key, val) => isEnum(key, option.enum) && isEnum(val, editOption.enum))))) {
        Logger.throw('Editor.SelectionInputComponent', 'Relative field not of expected type', field, value)
        return null
    }

    const handleChange = (values: unknown): void => {
        dispatch.setData(field, values)
    }

    return (
        <GroupItemComponent
            className={styles.editList}
            data={asBooleanString(fill)}
            labelId={labelId}
            labelArgs={labelArgs}>
            { type === 'string' &&
                <SelectionMenu
                    type={type}
                    values={value as Record<string, string>}
                    defaultValue=''
                    options={options}
                    componentClassName={styles.editSelectionItem}
                    onChange={handleChange}/>
            }
            { type === 'number' &&
                <SelectionMenu
                    type={type}
                    values={value as Record<string, number>}
                    options={options}
                    defaultValue={0}
                    componentClassName={styles.editSelectionItem}
                    onChange={handleChange}/>
            }
            { type === 'enum' &&
                <SelectionMenu
                    type={type}
                    values={value as Record<string, string>}
                    options={options}
                    editOptions={editOptions}
                    defaultValue={String(editOption!.default)}
                    componentClassName={styles.editSelectionItem}
                    onChange={handleChange}/>
            }
            { type === 'none' &&
                <SelectionMenu
                    type={type}
                    values={value as string[]}
                    options={options}
                    componentClassName={styles.editSelectionItem}
                    onChange={handleChange}/>
            }
        </GroupItemComponent>
    )
}

export default SelectionInputComponent

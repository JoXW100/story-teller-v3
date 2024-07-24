import React, { useContext } from 'react'
import GroupItemComponent from './groupItem'
import { Context } from 'components/contexts/file'
import ListMenu from 'components/controls/menus/list'
import { asBooleanString, isNumber, isRecord, isString, getRelativeFieldObject } from 'utils'
import Logger from 'utils/logger'
import { useLocalizedOptions, useLocalizedText } from 'utils/hooks/localization'
import type { LanguageKey } from 'assets'
import { getOptionType, type IOptionType, type OptionTypeKey } from 'structure/optionData'
import styles from '../style.module.scss'

type ListComponentParams = React.PropsWithChildren<{
    field: string
    type: 'string' | 'number' | 'enum'
    enumType?: OptionTypeKey
    labelId: LanguageKey
    labelArgs?: any[]
    placeholderId?: LanguageKey
    placeholderArgs?: any[]
    allowNegative?: boolean
    editEnabled?: boolean
    fill?: boolean
}>

const ListComponent: React.FC<ListComponentParams> = ({ field, type, enumType, labelId, labelArgs, placeholderId, placeholderArgs, fill = false, editEnabled = false, allowNegative = false }) => {
    const [context, dispatch] = useContext(Context)
    const placeholder = useLocalizedText(placeholderId, placeholderArgs)
    const options = useLocalizedOptions(enumType)

    if (!isRecord(context.file.data)) {
        Logger.throw('Editor.LinkListComponent', 'Data of incorrect type', context.file.data)
        return null
    }

    const relative = getRelativeFieldObject(field, context.file.data)
    if (relative === null) {
        Logger.throw('Editor.LinkListComponent', 'Failed to get relative field', field)
        return null
    }

    let option: IOptionType | null = null
    if (type === 'enum') {
        if (enumType === undefined) {
            Logger.throw('Editor.LinkListComponent', 'No enum type specified', field)
            return null
        }
        option = getOptionType(enumType)
        if (option === null) {
            Logger.throw('Editor.LinkListComponent', 'Invalid enum type specified', field, enumType)
            return null
        }
    }

    const handleValidate = (value: unknown): boolean => {
        return (type === 'number' && isNumber(value) && (allowNegative || value >= 0)) ||
            (type === 'string' && isString(value))
    }

    const value = relative.relative[relative.key]
    if (!Array.isArray(value) || !value.every(handleValidate)) {
        Logger.throw('Editor.LinkListComponent', 'Relative field not of expected type', field, value)
        return null
    }

    const handleChange = (values: unknown[]): void => {
        dispatch.setData(field, values)
    }

    return (
        <GroupItemComponent className={styles.editList} data={asBooleanString(fill)} labelId={labelId} labelArgs={labelArgs}>
            { type === 'number' &&
                <ListMenu
                    itemClassName={styles.itemListItem}
                    values={value}
                    type={type}
                    defaultValue={0}
                    onChange={handleChange}
                    validateInput={handleValidate}
                    placeholder={placeholder}
                    editEnabled={editEnabled}
                    addLast/>
            }
            { type === 'string' &&
                <ListMenu
                    itemClassName={styles.itemListItem}
                    values={value}
                    type={type}
                    defaultValue=''
                    onChange={handleChange}
                    validateInput={handleValidate}
                    placeholder={placeholder}
                    editEnabled={editEnabled}
                    addLast/>
            }
            { type === 'enum' &&
                <ListMenu
                    itemClassName={styles.itemListItem}
                    values={value}
                    type={type}
                    options={options}
                    defaultValue={option!.default}
                    onChange={handleChange}
                    validateInput={handleValidate}
                    editEnabled={editEnabled}
                    addLast/>
            }
        </GroupItemComponent>
    )
}

export default ListComponent

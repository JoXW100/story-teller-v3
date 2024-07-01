import React, { useContext } from 'react'
import GroupItemComponent from './groupItem'
import { Context, getRelativeFieldObject } from 'components/contexts/file'
import ListMenu from 'components/layouts/menus/list'
import { asBooleanString, isNumber, isRecord, isString } from 'utils'
import Logger from 'utils/logger'
import { useLocalizedText } from 'utils/hooks/localizedText'
import type { LanguageKey } from 'data'
import styles from '../style.module.scss'

type ListComponentParams = React.PropsWithChildren<{
    field: string
    type: 'string' | 'number'
    labelId: LanguageKey
    labelArgs?: any[]
    placeholderId?: LanguageKey
    placeholderArgs?: any[]
    allowNegative?: boolean
    allowDecimal?: boolean
    editEnabled?: boolean
    fill?: boolean
    deps?: string[]
}>

const ListComponent: React.FC<ListComponentParams> = ({ field, type, labelId, labelArgs, placeholderId, placeholderArgs, fill = false, editEnabled = false, allowDecimal = false, allowNegative = false, deps = [] }) => {
    const [context, dispatch] = useContext(Context)
    const placeholder = useLocalizedText(placeholderId, placeholderArgs)
    if (!isRecord(context.file.data)) {
        Logger.throw('Editor.LinkListComponent', 'Data of incorrect type', context.file.data)
        return null
    }

    const relative = getRelativeFieldObject(field, context.file.data)
    if (relative === null) {
        Logger.throw('Editor.LinkListComponent', 'Failed to get relative field', field)
        return null
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
        dispatch.setData(field, values, deps)
    }

    return (
        <GroupItemComponent className={styles.editList} data={asBooleanString(fill)} labelId={labelId} labelArgs={labelArgs}>
            { type === 'number' &&
                <ListMenu<number>
                    itemClassName={styles.itemListItem}
                    values={value}
                    type={type}
                    defaultValue={0}
                    onChange={handleChange}
                    createValue={(value) => allowDecimal ? value : Math.floor(value)}
                    createInput={Number}
                    validateInput={handleValidate}
                    placeholder={placeholder}
                    editEnabled={editEnabled}
                    addLast/>
            }
            { type === 'string' &&
                <ListMenu<string>
                    itemClassName={styles.itemListItem}
                    values={value}
                    type={type}
                    defaultValue=''
                    onChange={handleChange}
                    createValue={String}
                    createInput={String}
                    validateInput={handleValidate}
                    placeholder={placeholder}
                    editEnabled={editEnabled}
                    addLast/>
            }
        </GroupItemComponent>
    )
}

export default ListComponent

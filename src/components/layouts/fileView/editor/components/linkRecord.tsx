import React, { useContext } from 'react'
import GroupItemComponent from './groupItem'
import { Context, getRelativeFieldObject } from 'components/contexts/file'
import LinkRecordMenu from 'components/layouts/menus/linkRecord'
import { isEnum, isNumber, isObjectId, isRecord, isString } from 'utils'
import Logger from 'utils/logger'
import { useLocalizedText } from 'utils/hooks/localizedText'
import type { LanguageKey } from 'data'
import type { DocumentType } from 'structure/database'
import { getOptionType, type IOptionType, type OptionTypeKey } from 'structure/optionData'
import type { ObjectId } from 'types'
import styles from '../style.module.scss'

type LinkRecordComponentParams = React.PropsWithChildren<{
    field: string
    type: 'text' | 'number' | 'enum'
    allowedTypes: DocumentType[]
    defaultValue: string | number
    enumType?: OptionTypeKey
    labelId: LanguageKey
    labelArgs?: any[]
    placeholderId?: LanguageKey
    placeholderArgs?: any[]
    deps?: string[]
}>

const LinkRecordComponent: React.FC<LinkRecordComponentParams> = ({ field, type, enumType, allowedTypes, defaultValue, labelId, labelArgs, placeholderId, placeholderArgs, deps = [] }) => {
    const [context, dispatch] = useContext(Context)
    const placeholder = useLocalizedText(placeholderId, placeholderArgs)
    if (!isRecord(context.file.data)) {
        Logger.throw('Editor.LinkRecordComponent', 'Data of incorrect type', context.file.data)
        return null
    }

    const relative = getRelativeFieldObject(field, context.file.data)
    if (relative === null) {
        Logger.throw('Editor.LinkRecordComponent', 'Failed to get relative field', field)
        return null
    }

    let option: IOptionType | null = null
    if (type === 'enum') {
        if (enumType === undefined) {
            Logger.throw('Editor.LinkRecordComponent', 'No enum type specified', field)
            return null
        }

        option = getOptionType(enumType as OptionTypeKey)
        if (option === null) {
            Logger.throw('Editor.LinkRecordComponent', 'No option type of type: ' + enumType, field)
            return null
        }
    }

    const value = relative.relative[relative.key]
    if (!isRecord(value, (key, val) => isObjectId(key) && (
        (type === 'text' && isString(val)) ||
        (type === 'number' && isNumber(val)) ||
        (type === 'enum' && isEnum(val, option!.enum))))) {
        Logger.throw('Editor.LinkRecordComponent', 'Relative field not of expected type', field, value)
        return null
    }

    const handleChange = (values: Record<ObjectId, unknown>): void => {
        dispatch.setData(field, values, deps)
    }

    return (
        <GroupItemComponent className={styles.editList} labelId={labelId} labelArgs={labelArgs}>
            { type === 'text' &&
                <LinkRecordMenu
                    itemClassName={styles.editSelectionItem}
                    editClassName={styles.editListItem}
                    type={type}
                    value={value as Record<ObjectId, string>}
                    defaultValue={String(defaultValue)}
                    onChange={handleChange}
                    placeholder={placeholder}
                    allowedTypes={allowedTypes}/>
            }
            { type === 'number' &&
                <LinkRecordMenu
                    itemClassName={styles.editSelectionItem}
                    editClassName={styles.editListItem}
                    type={type}
                    value={value as Record<ObjectId, number>}
                    defaultValue={Number(defaultValue)}
                    onChange={handleChange}
                    placeholder={placeholder}
                    allowedTypes={allowedTypes}/>
            }
            { type === 'enum' &&
                <LinkRecordMenu
                    itemClassName={styles.editSelectionItem}
                    editClassName={styles.editListItem}
                    type={type}
                    value={value as Record<ObjectId, string>}
                    options={option!.options}
                    defaultValue={option!.default}
                    onChange={handleChange}
                    placeholder={placeholder}
                    allowedTypes={allowedTypes}/>
            }
        </GroupItemComponent>
    )
}

export default LinkRecordComponent

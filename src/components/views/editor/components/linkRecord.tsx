import React, { useContext } from 'react'
import EditIcon from '@mui/icons-material/EditSharp'
import type { EditorPageKeyType } from '..'
import GroupItemComponent from './groupItem'
import { Context } from 'components/contexts/file'
import LinkRecordMenu, { type ILinkRecordMenuButtonProps } from 'components/controls/menus/linkRecord'
import type { LanguageKey } from 'assets'
import { asBooleanString, isEnum, isNumber, isObjectId, isRecord, isString, getRelativeFieldObject } from 'utils'
import Logger from 'utils/logger'
import { useLocalizedOptions, useLocalizedText } from 'utils/hooks/localization'
import { getEnumType, type IEnumType, type EnumTypeKey } from 'structure/enums'
import type { DocumentType } from 'structure/database'
import type { ObjectId } from 'types'
import styles from '../style.module.scss'

type LinkRecordComponentParams = React.PropsWithChildren<{
    field: string
    type: 'text' | 'number' | 'enum' | 'edit'
    editPage?: EditorPageKeyType
    enumType?: EnumTypeKey
    allowedTypes: readonly DocumentType[]
    defaultValue: string | number | object
    root?: string
    labelId: LanguageKey
    labelArgs?: any[]
    placeholderId?: LanguageKey
    placeholderArgs?: any[]
    fill?: boolean
}>

const LinkRecordComponent: React.FC<LinkRecordComponentParams> = ({ field, type, editPage, enumType, allowedTypes, defaultValue, labelId, labelArgs, placeholderId, placeholderArgs, fill = false }) => {
    const [context, dispatch] = useContext(Context)
    const placeholder = useLocalizedText(placeholderId, placeholderArgs)
    const buttonTooltips = useLocalizedText('common-edit')
    const options = useLocalizedOptions(enumType)

    if (!isRecord(context.file.data)) {
        Logger.throw('Editor.LinkRecordComponent', 'Data of incorrect type', context.file.data)
        return null
    }

    const relative = getRelativeFieldObject(field, context.file.data)
    if (relative === null) {
        Logger.throw('Editor.LinkRecordComponent', 'Failed to get relative field', field)
        return null
    }

    let option: IEnumType | null = null
    if (type === 'enum') {
        if (enumType === undefined) {
            Logger.throw('Editor.LinkRecordComponent', 'No enum type specified', field)
            return null
        }

        option = getEnumType(enumType)
        if (option === null) {
            Logger.throw('Editor.LinkRecordComponent', 'No option type of type: ' + enumType, field)
            return null
        }
    }

    if (type === 'edit') {
        if (editPage === undefined) {
            Logger.throw('Editor.LinkRecordComponent', 'No edit page specified', field)
            return null
        }
    }

    const value = relative.relative[relative.key]
    if (!isRecord(value, (key, val) => isObjectId(key) && (
        (type === 'text' && isString(val)) ||
        (type === 'number' && isNumber(val)) ||
        (type === 'enum' && isEnum(val, option!.enum)) ||
        (type === 'edit' && isRecord(val))
    ))) {
        Logger.throw('Editor.LinkRecordComponent', 'Relative field not of expected type', field, value)
        return null
    }

    const handleChange = (values: Record<ObjectId, unknown>): void => {
        dispatch.setData(field, values)
    }

    const handleClick: ILinkRecordMenuButtonProps['onClick'] = (id, file): void => {
        if (file !== null) {
            dispatch.pushEditorPage({
                pageKey: editPage!,
                root: `${field}.${id}`,
                name: file.getTitle()
            })
        }
    }

    return (
        <GroupItemComponent className={styles.editList} data={asBooleanString(fill)} labelId={labelId} labelArgs={labelArgs}>
            { type === 'text' &&
                <LinkRecordMenu
                    itemClassName={styles.editSelectionItem}
                    editClassName={styles.editRecordItem}
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
                    editClassName={styles.editRecordItem}
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
                    editClassName={styles.editRecordItem}
                    type={type}
                    value={value as Record<ObjectId, string>}
                    options={options}
                    defaultValue={option!.default}
                    onChange={handleChange}
                    placeholder={placeholder}
                    allowedTypes={allowedTypes}/>
            }
            { type === 'edit' &&
                <LinkRecordMenu
                    type="button"
                    itemClassName={styles.editRecordItem}
                    editClassName={styles.editRecordItem}
                    buttonContent={<EditIcon className='small-icon'/>}
                    value={value as Record<ObjectId, object>}
                    defaultValue={defaultValue as object}
                    onChange={handleChange}
                    onClick={handleClick}
                    buttonTooltips={buttonTooltips}
                    placeholder={placeholder}
                    allowedTypes={allowedTypes}/>
            }
        </GroupItemComponent>
    )
}

export default LinkRecordComponent

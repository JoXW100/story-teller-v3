import React, { useContext } from 'react'
import GroupItemComponent from './groupItem'
import { Context, getRelativeFieldObject } from 'components/contexts/file'
import LinkListMenu from 'components/layouts/menus/link'
import { asBooleanString, isObjectId, isRecord, isString } from 'utils'
import Logger from 'utils/logger'
import { isValidAbilityFormat, toAbility } from 'utils/importers/stringFormatAbilityImporter'
import { useLocalizedText } from 'utils/hooks/localizedText'
import type { LanguageKey } from 'data'
import { DocumentType } from 'structure/database'
import type DatabaseFile from 'structure/database/files'
import type { ObjectId } from 'types'
import styles from '../style.module.scss'
import AbilityDocument from 'structure/database/files/ability'

type LinkListComponentParams = React.PropsWithChildren<{
    field: string
    labelId: LanguageKey
    labelArgs?: any[]
    allowedTypes: readonly DocumentType[]
    placeholderId?: LanguageKey
    placeholderArgs?: any[]
    fill?: boolean
    allowText?: boolean
    deps?: string[]
}>

const LinkListComponent: React.FC<LinkListComponentParams> = ({ field, labelId, labelArgs, allowedTypes, placeholderId, placeholderArgs, fill = false, allowText = false, deps = [] }) => {
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

    const handleValidate = (value: unknown): value is ObjectId => {
        return isObjectId(value) || (allowText && isString(value) && isValidAbilityFormat(value))
    }

    const value = relative.relative[relative.key]
    if (!Array.isArray(value) || !value.every(handleValidate)) {
        Logger.throw('Editor.LinkListComponent', 'Relative field not of expected type', field, value)
        return null
    }

    const handleChange = (values: Array<ObjectId | string>): void => {
        dispatch.setData(field, values, deps)
    }

    const handleParseText = (value: string): DatabaseFile | null => {
        if (allowText) {
            const data = toAbility(value)
            return data !== null
                ? new AbilityDocument({
                    id: 'custom' as any,
                    type: DocumentType.Ability,
                    name: 'custom',
                    isOwner: true,
                    dateCreated: 0,
                    dateUpdated: 0,
                    data: data,
                    storage: {}
                })
                : null
        }
        return null
    }

    return (
        <GroupItemComponent className={styles.editList} data={asBooleanString(fill)} labelId={labelId} labelArgs={labelArgs}>
            <LinkListMenu
                itemClassName={styles.itemListItem}
                editClassName={styles.editListItem}
                values={value}
                onChange={handleChange}
                validateInput={handleValidate}
                parseText={handleParseText}
                placeholder={placeholder}
                allowedTypes={allowedTypes}
                allowText={allowText}/>
        </GroupItemComponent>
    )
}

export default LinkListComponent

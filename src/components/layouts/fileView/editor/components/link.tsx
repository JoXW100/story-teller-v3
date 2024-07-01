import React, { useContext } from 'react'
import GroupItemComponent from './groupItem'
import { Context, getRelativeFieldObject } from 'components/contexts/file'
import LinkInput from 'components/layouts/linkInput'
import { asObjectId, isObjectIdOrNull, isRecord } from 'utils'
import Logger from 'utils/logger'
import { useLocalizedText } from 'utils/hooks/localizedText'
import type { LanguageKey } from 'data'
import type { DocumentType } from 'structure/database'
import styles from '../style.module.scss'

type LinkComponentParams = React.PropsWithChildren<{
    field: string
    labelId: LanguageKey
    labelArgs?: any[]
    allowedTypes: readonly DocumentType[]
    placeholderId?: LanguageKey
    placeholderArgs?: any[]
    deps?: string[]
}>

const LinkComponent: React.FC<LinkComponentParams> = ({ field, labelId, labelArgs, allowedTypes, placeholderId, placeholderArgs, deps = [] }) => {
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

    const value = relative.relative[relative.key]
    if (!isObjectIdOrNull(value)) {
        Logger.throw('Editor.LinkListComponent', 'Relative field not of expected type', field, value)
        return null
    }

    const handleChange = (newValue: string): void => {
        const res = asObjectId(newValue)
        if (res !== value) {
            dispatch.setData(field, res, deps)
        }
    }

    return (
        <GroupItemComponent labelId={labelId} labelArgs={labelArgs}>
            <div className='fill flex-row'>
                <LinkInput
                    className={styles.editInput}
                    value={value ?? ''}
                    placeholder={placeholder}
                    allowedTypes={allowedTypes}
                    allowText={false}
                    onChange={handleChange}/>
            </div>
        </GroupItemComponent>
    )
}

export default LinkComponent

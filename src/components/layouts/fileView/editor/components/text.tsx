import React, { useContext } from 'react'
import { Context } from 'components/contexts/file'
import GroupItemComponent from './groupItem'
import { isRecord, getRelativeFieldObject } from 'utils'
import Logger from 'utils/logger'
import { useLocalizedText } from 'utils/hooks/localizedText'
import type { LanguageKey } from 'data'
import styles from '../style.module.scss'

type TextComponentParams = React.PropsWithoutRef<{
    field: string
    labelId: LanguageKey
    labelArgs?: any[]
    placeholderId?: LanguageKey
    placeholderArgs?: any[]
}>

const TextComponent: React.FC<TextComponentParams> = ({ field, labelId, labelArgs, placeholderId = null, placeholderArgs }) => {
    const [context, dispatch] = useContext(Context)
    const placeholder = useLocalizedText(placeholderId, placeholderArgs)
    if (!isRecord(context.file.data)) {
        Logger.throw('Editor.TextComponent', 'Data of incorrect type', context.file.data)
        return null
    }

    const relative = getRelativeFieldObject(field, context.file.data)
    if (relative === null) {
        Logger.throw('Editor.TextComponent', 'Failed to get relative field', field)
        return null
    }

    const value = relative.relative[relative.key]
    if (typeof value !== 'string') {
        Logger.throw('Editor.TextComponent', 'Relative field not of expected type', field, value)
        return null
    }

    const handleInput: React.ChangeEventHandler<HTMLInputElement> = (e): void => {
        dispatch.setData(field, e.target.value)
    }

    return (
        <GroupItemComponent labelId={labelId} labelArgs={labelArgs}>
            <input
                className={styles.editInput}
                value={value}
                type="text"
                placeholder={placeholder}
                onChange={handleInput}/>
        </GroupItemComponent>
    )
}

export default TextComponent

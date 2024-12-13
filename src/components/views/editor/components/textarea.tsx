import React, { useContext } from 'react'
import GroupItemComponent from './groupItem'
import type { LanguageKey } from 'assets'
import TextEditor from 'components/controls/textEditor'
import { Context } from 'components/contexts/file'
import { isRecord, getRelativeFieldObject, asBooleanString } from 'utils'
import Logger from 'utils/logger'
import type { IToken, TokenContext } from 'types/language'
import styles from '../style.module.scss'

type TextareaComponentParams = React.PropsWithoutRef<{
    field: string
    labelId: LanguageKey
    labelArgs?: any[]
    languageContext?: TokenContext
    fill?: boolean
}>

const TextareaComponent: React.FC<TextareaComponentParams> = ({ field, labelId, labelArgs, languageContext = {}, fill = false }) => {
    const [context, dispatch] = useContext(Context)
    if (!isRecord(context.file.data)) {
        Logger.throw('Editor.TextareaComponent', 'Data of incorrect type', context.file.data)
        return null
    }

    const relative = getRelativeFieldObject(field, context.file.data)
    if (relative === null) {
        Logger.warn('Editor.TextareaComponent', 'Failed to get relative field', field)
        return null
    }

    const value = relative.relative[relative.key]
    if (typeof value !== 'string') {
        Logger.warn('Editor.TextareaComponent', 'Relative field not of expected type', field, value)
        return null
    }

    const handleInput = (value: string, _token: IToken | null): void => {
        dispatch.setData(field, value)
    }

    return (
        <GroupItemComponent
            className={styles.editTextArea}
            data={asBooleanString(fill)}
            labelId={labelId}
            labelArgs={labelArgs}>
            <TextEditor
                value={value}
                className='fill-height'
                context={languageContext}
                onChange={handleInput}/>
        </GroupItemComponent>
    )
}

export default TextareaComponent

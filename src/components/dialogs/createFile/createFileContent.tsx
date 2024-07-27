import React, { useRef, useState } from 'react'
import { type CreateContentProps, type CreateFilePopupData } from '.'
import LocalizedText from 'components/controls/localizedText'
import DropdownMenu from 'components/controls/dropdownMenu'
import { useLocalizedText } from 'utils/hooks/localization'
import { DocumentType } from 'structure/database'
import type { LanguageKey } from 'assets'
import styles from './style.module.scss'

function createFileOptionMap(): Record<DocumentType, React.ReactNode> {
    const map: Partial<Record<DocumentType, React.ReactNode>> = {}
    for (const type of Object.values(DocumentType)) {
        map[type] = <LocalizedText id={`document-${type}` as LanguageKey}/>
    }
    return map as Record<DocumentType, React.ReactNode>
}

export const FileOptionMap = createFileOptionMap()

const CreateFileContent: React.FC<CreateContentProps> = ({ callback }) => {
    const ref = useRef<HTMLButtonElement>(null)
    const placeholder = useLocalizedText('dialog-createFile-fileNamePlaceholder')
    const [state, setState] = useState<CreateFilePopupData>({
        name: '', type: DocumentType.Text, data: {}
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setState({ ...state, name: e.target.value })
    }

    const handleInput = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter' && ref.current?.disabled !== true) {
            ref.current?.click()
        }
    }

    const handleClick = (): void => {
        callback(state)
    }

    return (
        <>
            <div className={styles.inputRow}>
                <LocalizedText id='dialog-createFile-fileNamePrompt' className='no-line-break'/>
                <input
                    value={state.name}
                    onChange={handleChange}
                    onKeyDown={handleInput}
                    placeholder={placeholder}/>
            </div>
            <div className={styles.inputRow}>
                <LocalizedText id='dialog-createFile-typePrompt' className='no-line-break'/>
                <DropdownMenu
                    className={styles.dropdown}
                    value={state.type}
                    values={FileOptionMap}
                    onChange={(value) => { setState({ ...state, type: value }) }}/>
            </div>
            <div className={styles.inputRowLast}>
                <button
                    ref={ref}
                    onClick={handleClick}
                    disabled={state.name.length === 0 || state.type == null}>
                    <LocalizedText id='dialog-createFile-button' className='no-line-break'/>
                </button>
            </div>
        </>
    )
}

export default CreateFileContent

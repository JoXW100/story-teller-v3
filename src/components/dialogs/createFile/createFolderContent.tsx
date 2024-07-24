import { useRef, useState } from 'react'
import { type CreateContentProps } from '.'
import LocalizedText from 'components/controls/localizedText'
import { useLocalizedText } from 'utils/hooks/localization'
import { FileType } from 'structure/database'
import styles from './style.module.scss'

const CreateFolderContent: React.FC<CreateContentProps> = ({ callback }) => {
    const ref = useRef<HTMLButtonElement | null>(null)
    const placeholder = useLocalizedText('dialog-createFile-folderNamePlaceholder')
    const [value, setValue] = useState('')

    const handleClick = (): void => {
        callback({ name: value, type: FileType.Folder, data: { open: false } })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setValue(e.target.value)
    }

    const handleInput = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter' && ref.current?.disabled !== true) {
            ref.current?.click()
        }
    }

    return (
        <>
            <div className={styles.inputRow}>
                <LocalizedText id='dialog-createFile-folderNamePrompt' className='no-line-break'/>
                <input
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleInput}
                    placeholder={placeholder}
                />
            </div>
            <div className={styles.inputRowLast}>
                <button
                    ref={ref}
                    onClick={handleClick}
                    disabled={value.length === 0}>
                    <LocalizedText id='dialog-createFile-button' className='no-line-break'/>
                </button>
            </div>
        </>
    )
}

export default CreateFolderContent

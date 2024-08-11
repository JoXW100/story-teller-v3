import { useState } from 'react'
import Dialog from '.'
import LocalizedText from 'components/controls/localizedText'
import LinkListMenu from 'components/controls/menus/link'
import { DocumentType } from 'structure/database'
import type { ObjectId } from 'types'
import type { DialogArgs } from 'types/dialog'
import styles from './style.module.scss'

const AllowedTypes = [DocumentType.Condition] as const
const ManageConditionsDialog: React.FC<DialogArgs<'manageConditions'>> = ({ id, values, story, callback }) => {
    const [fileIds, setFileIds] = useState(values)

    const handleClose = (): void => {
        callback('onClose')
    }

    const handleSelect = (): void => {
        callback('onConfirm', fileIds)
        callback('onClose')
    }

    const handleValidateInput = (value: ObjectId, values: ObjectId[]): boolean => {
        return !values.includes(value)
    }

    return (
        <Dialog id={id} onClose={handleClose}>
            <div className={styles.holder}>
                <div className={styles.dialogHeader}>
                    <LocalizedText id='dialog-manageConditions-header'/>
                </div>
                <LinkListMenu
                    values={fileIds}
                    story={story}
                    allowedTypes={AllowedTypes}
                    onChange={setFileIds}
                    validateInput={handleValidateInput}
                    allowText={false}/>
                <div className={styles.dialogButtonGroup}>
                    <button id='selectFile-button' onClick={handleSelect}>
                        <LocalizedText id='dialog-confirmation-positive'/>
                    </button>
                </div>
            </div>
        </Dialog>
    )
}

export default ManageConditionsDialog

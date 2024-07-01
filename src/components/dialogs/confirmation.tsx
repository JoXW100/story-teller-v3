import Dialog from '.'
import LocalizedText from 'components/localizedText'
import type { DialogArgs } from 'types/dialog'
import styles from './style.module.scss'

const ConfirmationDialog: React.FC<DialogArgs<'confirmation'>> = ({ id, headerTextId, bodyTextId, headerTextArgs, bodyTextArgs, callback }) => {
    const handleButtonClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        switch (e.currentTarget.id) {
            case 'confirmation-button-positive':
                callback('onConfirm')
                break
            case 'confirmation-button-negative':
                callback('onCancel')
                break
            default:
                break
        }
    }

    const handleClose = (): void => {
        callback('onClose')
    }

    return (
        <Dialog id={id} onClose={handleClose}>
            <div className={styles.holder}>
                <div className={styles.dialogHeader}>
                    <LocalizedText id={headerTextId} args={headerTextArgs}/>
                </div>
                { bodyTextId !== undefined &&
                    <div className={styles.dialogBody}>
                        <LocalizedText id={bodyTextId} args={bodyTextArgs}/>
                    </div>
                }
                <div className={styles.dialogButtonGroup}>
                    <button id='confirmation-button-positive' data='good' onClick={handleButtonClick}>
                        <LocalizedText id='dialog-confirmation-positive'/>
                    </button>
                    <button id='confirmation-button-negative' data='bad' onClick={handleButtonClick}>
                        <LocalizedText id='dialog-confirmation-negative'/>
                    </button>
                </div>
            </div>
        </Dialog>
    )
}

export default ConfirmationDialog

import Dialog from '.'
import LocalizedText from 'components/localizedText'
import { type DialogArgs } from 'types/dialog'
import styles from './style.module.scss'

const NoticeDialog: React.FC<DialogArgs<'notice'>> = ({ id, headerTextId, bodyTextId, headerTextArgs, bodyTextArgs, callback }) => {
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
                    <button id='notice-button' onClick={handleClose}>
                        <LocalizedText id='dialog-notice-button'/>
                    </button>
                </div>
            </div>
        </Dialog>
    )
}

export default NoticeDialog

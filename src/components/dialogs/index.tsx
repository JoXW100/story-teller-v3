import MDialog from '@mui/material/Dialog'
import styles from './style.module.scss'

type DialogParams = React.PropsWithChildren<{
    id: string
    onClose?: React.ReactEventHandler<HTMLDialogElement>
}>

const Dialog: React.FC<DialogParams> = ({ onClose, children }) => {
    return (
        <MDialog open fullScreen onClose={onClose} classes={{
            container: styles.container,
            paper: styles.paper
        }}>
            { children }
        </MDialog>
    )
}

export default Dialog

import LockIcon from '@mui/icons-material/LockSharp'
import LocalizedText from 'components/controls/localizedText'
import type { LanguageKey } from 'assets'

type LockedProps = React.PropsWithChildren<{
    locked: boolean
    textId: LanguageKey
}>

const Locked: React.FC<LockedProps> = ({ locked, textId, children }): React.ReactNode => {
    if (locked) {
        return (
            <div>
                <LocalizedText className='no-line-break' id={textId}/>
                <LockIcon className='icon circular-center color-interactive padding-medium'/>
            </div>
        )
    } else {
        return children
    }
}

export default Locked

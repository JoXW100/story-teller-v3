import LocalizedText from './localizedText'
import LockIcon from '@mui/icons-material/LockSharp'
import type { LanguageKey } from 'data'

type LockedProps = React.PropsWithChildren<{
    locked: boolean
    textId: LanguageKey
}>

const Locked: React.FC<LockedProps> = ({ locked, textId, children }): React.ReactNode => {
    if (locked) {
        return (
            <div>
                <LocalizedText className='no-line-break' id={textId}/>
                <LockIcon/>
            </div>
        )
    } else {
        return children
    }
}

export default Locked

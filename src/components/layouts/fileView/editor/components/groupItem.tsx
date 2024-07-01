import LocalizedText from 'components/localizedText'
import type { LanguageKey } from 'data'
import styles from '../style.module.scss'

type GroupComponentParams = React.PropsWithChildren<{
    className?: string
    data?: string
    labelId: LanguageKey
    labelArgs?: any[]
}>

const GroupItemComponent: React.FC<GroupComponentParams> = ({ children, className, data, labelId, labelArgs }) => {
    return (
        <div className={className ?? styles.editGroupItem} data={data}>
            <LocalizedText className='no-line-break font-bold' id={labelId} args={labelArgs}/>
            { children }
        </div>
    )
}

export default GroupItemComponent

import type { ContextRowData } from './types'
import LocalizedText from 'components/controls/localizedText'
import styles from './style.module.scss'

type ContextMenuItemProps = React.PropsWithRef<{
    data: ContextRowData
}>

const ContextMenuItem: React.FC<ContextMenuItemProps> = ({ data }) => {
    let option: 'hide' | 'content' | undefined
    if (data.hide === true) {
        option = 'hide'
    } else if (Array.isArray(data.content)) {
        option = 'content'
    }
    return (
        <div
            id={data.id}
            className={styles.item}
            onContextMenu={(e) => { e.preventDefault() }}
            onClick={data.action}
            data={option}
            disabled={data.disabled}>
            { data.icon }
            <LocalizedText className='no-line-break' id={data.text}/>
            {Array.isArray(data.content) && data.content.length > 0 &&
                <div className={styles.content}>
                    { data.content.map((data, index) =>
                        <ContextMenuItem key={index} data={data}/>
                    )}
                </div>
            }
        </div>
    )
}

export default ContextMenuItem

import type { ContextRowData } from './types'
import styles from './style.module.scss'
import LocalizedText from 'components/controls/localizedText'

type ContextMenuItemProps = React.PropsWithRef<{
    data: ContextRowData
}>

const ContextMenuItem: React.FC<ContextMenuItemProps> = ({ data }) => {
    return (
        <div
            id={data.id}
            className={styles.item}
            onContextMenu={(e) => { e.preventDefault() }}
            onClick={data.action}
            data={(data.enabled ?? true) ? data.content !== undefined ? 'content' : undefined : 'hide'}>
            { data.icon }
            <LocalizedText id={data.text}/>
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

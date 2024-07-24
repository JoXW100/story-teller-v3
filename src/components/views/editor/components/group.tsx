import React, { useState } from 'react'
import styles from '../style.module.scss'

type GroupComponentParams = React.PropsWithChildren<{
    header: React.ReactNode
    open?: boolean
    fill?: boolean
}>

const GroupComponent: React.FC<GroupComponentParams> = ({ children, header, open = false, fill = false }) => {
    const [isOpen, setOpen] = useState(open)

    return (
        <div className={styles.editGroup} data={String(fill && isOpen)}>
            <button
                className={styles.editGroupHeader}
                onClick={() => { setOpen(!isOpen) }}
                data={String(isOpen)}>
                { header }
            </button>
            <div>
                { isOpen && children }
            </div>
        </div>
    )
}

export default GroupComponent

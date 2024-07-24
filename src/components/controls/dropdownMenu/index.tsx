import { type ReactNode, useCallback, useEffect, useState } from 'react'
import DropDownIcon from '@mui/icons-material/ArrowDropDownSharp'
import DropUpIcon from '@mui/icons-material/ArrowDropUpSharp'
import { keysOf } from 'utils'
import styles from './style.module.scss'

type DropdownMenuProps<T extends string | number | symbol = string> = React.PropsWithRef<{
    className?: string
    itemClassName?: string
    value: T
    values: Partial<Record<T, ReactNode>>
    exclude?: T[]
    showButton?: boolean
    disabled?: boolean
    onChange?: (value: T) => void
}>

const DropdownMenu = <T extends string | number | symbol = string>({ className, itemClassName, value, values, exclude = [], showButton = true, disabled = false, onChange }: DropdownMenuProps<T>): React.ReactNode => {
    const [open, setOpen] = useState(false)
    const isDisabled = disabled || (value in values && Object.keys(values).length <= 1) || keysOf(values).every(x => exclude.includes(x))
    const style = className !== undefined ? `${styles.dropdown} ${className}` : styles.dropdown
    const itemStyle = itemClassName !== undefined ? `${styles.dropdownItem} ${itemClassName}` : styles.dropdownItem
    const { [value]: _, ...rest } = values
    const keys = keysOf(rest as Partial<Record<T, ReactNode>>)

    const clickHandler = useCallback(() => {
        setOpen(false)
    }, [])

    const openHandler = (): void => {
        setOpen(!open)
    }

    const handleClick = (key: T): void => {
        if (value !== key) { onChange?.(key) }
    }

    useEffect(() => {
        if (open) {
            document.addEventListener('click', clickHandler, true)
            return () => { document.removeEventListener('click', clickHandler, true) }
        }
    }, [open, clickHandler])

    useEffect(() => {
        setOpen(false)
    }, [value, values])

    return (
        <div
            className={style}
            disabled={isDisabled}
            data={String(showButton)}>
            <div className={styles.content} onMouseLeave={clickHandler}>
                <div className={styles.menu} data={String(open)} onClick={openHandler}>
                    { [value, ...keys].map((key, index) => !exclude.includes(key) && (
                        <button key={index} className={itemStyle} onClick={() => { handleClick(key) }}>
                            { values[key] }
                        </button>
                    ))}
                </div>
            </div>
            <button className='center-flex fill-height square' onClick={openHandler}>
                { open ? <DropUpIcon className='small-icon'/> : <DropDownIcon className='small-icon'/> }
            </button>
        </div>
    )
}

export default DropdownMenu

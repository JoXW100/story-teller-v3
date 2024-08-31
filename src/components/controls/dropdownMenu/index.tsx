import { asKeyOf, isKeyOf, keysOf } from 'utils'

type DropdownMenuProps<T extends string | number> = React.PropsWithRef<{
    className?: string
    value?: T
    values: Partial<Record<T, React.ReactNode>>
    exclude?: T[]
    showButton?: boolean
    disabled?: boolean
    onChange?: (value: T) => void
}>

const DropdownMenu = <T extends string | number = string>({ className, value, values, exclude = [], disabled = false, onChange }: DropdownMenuProps<T>): React.ReactNode => {
    const isValue = isKeyOf(value, values)
    const isDisabled = disabled || (isValue && Object.keys(values).length <= 1) || keysOf(values).every(x => exclude.includes(x))

    const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        const value = asKeyOf(e.target.value, values)
        if (value !== null) {
            onChange?.(value)
        }
    }

    return (
        <select className={className} value={value ?? 'default'} onChange={handleChange} disabled={isDisabled}>
            { !isValue && <option value='default'/> }
            { keysOf(values).map((key) => !(exclude.includes(key) && key !== value) && (
                <option key={String(key)} value={String(key)}>
                    { values[key] }
                </option>
            ))}
        </select>
    )
}

export default DropdownMenu

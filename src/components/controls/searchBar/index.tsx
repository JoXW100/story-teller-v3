import { type ChangeEventHandler, type MouseEventHandler, useRef } from 'react'
import SearchIcon from '@mui/icons-material/SearchSharp'
import { useLocalizedText } from 'utils/hooks/localization'
import styles from './style.module.scss'

type SearchboxProps = React.PropsWithRef<{
    className?: string
    value: string
    onChange: (value: string) => void
}>

const SearchBar = ({ className, value, onChange }: SearchboxProps): JSX.Element => {
    const placeholder = useLocalizedText('component-searchBar-placeholder')
    const ref = useRef<HTMLInputElement>(null)
    const name = className !== undefined ? `${styles.main} ${className}` : styles.main

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        onChange(e.target.value)
    }

    const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
        if (e.target !== ref.current) {
            e.preventDefault()
            e.stopPropagation()
            ref.current?.select()
        }
    }

    return (
        <div className={name} onClick={handleClick}>
            <SearchIcon/>
            <input
                ref={ref}
                type='text'
                value={value}
                placeholder={placeholder}
                onChange={handleChange}/>
        </div>
    )
}

export default SearchBar

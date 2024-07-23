import CheckIcon from '@mui/icons-material/CheckSharp'
import styles from './style.module.scss'

type CheckboxProps = React.PropsWithRef<{
    className?: string
    value: boolean
    onChange: (newValue: boolean) => void
}>

const Checkbox = ({ className, value, onChange }: CheckboxProps): JSX.Element => {
    const name = className !== undefined ? `${styles.main} ${className}` : styles.main
    return (
        <button className={name} data={value ? 'true' : 'false'} onClick={() => { onChange(!value) }}>
            <CheckIcon className='fill small-icon'/>
        </button>
    )
}

export default Checkbox

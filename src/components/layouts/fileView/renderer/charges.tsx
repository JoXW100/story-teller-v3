import { useMemo, useState } from 'react'
import NumberInput from 'components/layouts/numericInput'
import styles from './styles.module.scss'

type ChargesRendererProps = React.PropsWithRef<{
    charges: number
    expended?: number
    fixed?: number
    setExpended?: (expended: number) => void
}>

type ChargeToggleProps = React.PropsWithRef<{
    expended: boolean
    fixed: boolean
    setExpended?: (value: boolean) => void
}>

const getChangeState = (expended: boolean, fixed: boolean): string | undefined => {
    if (fixed) {
        return 'fixed'
    } else if (expended) {
        return 'expended'
    } else {
        return undefined
    }
}

export const ChargeToggle: React.FC<ChargeToggleProps> = ({ expended, fixed, setExpended }) => {
    const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
        e.stopPropagation()
        if (!fixed) {
            setExpended?.(!expended)
        }
    }

    return (
        <div
            className={styles.chargeToggle}
            onClick={handleClick}
            data={getChangeState(expended, fixed)}/>
    )
}

const ChargesRenderer: React.FC<ChargesRendererProps> = ({ charges, expended = 0, fixed = 0, setExpended }) => {
    const [state, setState] = useState(false)
    const available = useMemo(() => Math.max(charges - expended - fixed, 0), [charges, expended, fixed])

    const handleChange = (value: number): void => {
        setExpended?.(Math.max(0, Math.min(charges - value - fixed, charges - fixed)))
    }

    const validate = (value: number): boolean => {
        return value <= charges - fixed
    }

    const handleFocusLost = (): void => {
        setState(false)
    }

    const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
        e.stopPropagation()
        setState(true)
    }

    if (charges > 99) {
        return null
    } else if (charges > 5) {
        return (
            <div className={styles.chargeToggleInputHolder} onClick={handleClick}>
                { state
                    ? <>
                        <NumberInput
                            value={available}
                            autoFocus={true}
                            validate={validate}
                            onChange={handleChange}
                            onFocusLost={handleFocusLost}/>
                        <b>{fixed > 0 ? ` / ${charges - fixed} (${charges})` : ` / ${charges}`}</b>
                    </>
                    : <b>{fixed > 0 ? `${available} / ${charges - fixed} (${charges})` : `${available} / ${charges}`}</b>
                }
            </div>
        )
    } else if (charges > 0) {
        return (
            <>
                {Array.from({ length: charges }, (_, i) => (
                    <ChargeToggle
                        key={i}
                        fixed={i < fixed}
                        expended={i < (fixed + expended)}
                        setExpended={(value) => { setExpended?.((value ? i + 1 : i) - fixed) }}/>
                ))}
            </>
        )
    } else {
        return null
    }
}

export default ChargesRenderer

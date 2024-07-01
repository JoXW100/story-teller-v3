import React, { useEffect, useState } from 'react'
import { asBooleanString } from 'utils'

type NumberInputProps = React.PropsWithRef<{
    value: number
    defaultValue?: number
    onChange: (value: number) => void
    validate?: (value: number) => boolean
    onFocusLost?: () => void
    placeholder?: string
    className?: string
    allowDecimal?: boolean
    allowNegative?: boolean
    disabled?: boolean
    autoFocus?: boolean
}>

const NumberInput = ({ value, defaultValue = 0, onChange, validate, onFocusLost, className, placeholder, allowDecimal = false, allowNegative = false, disabled = false, autoFocus = false }: NumberInputProps): JSX.Element => {
    const [state, setState] = useState({ text: '', error: false })

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const parser = allowDecimal ? parseFloat : parseInt
        const value = parser(e.target.value)
        if (isNaN(value) || (!allowNegative && value < 0) || (validate !== undefined && !validate(value))) {
            setState({ text: e.target.value, error: true })
        } else {
            setState({ text: e.target.value, error: false })
            onChange(value)
        }
    }

    const handleBlur = (): void => {
        onFocusLost?.()
        if (state.text !== String(value)) {
            setState({ text: String(defaultValue), error: false })
        }
    }

    useEffect(() => {
        setState((state) => {
            const text = String(value)
            if (text !== state.text) {
                return { text: text, error: false }
            }
            return state
        })
    }, [value])

    return (
        <input
            type="number"
            onChange={handleChange}
            onBlur={handleBlur}
            className={className}
            disabled={disabled}
            value={state.text}
            error={asBooleanString(state.error)}
            placeholder={placeholder}
            autoFocus={autoFocus}/>
    )
}

export default NumberInput

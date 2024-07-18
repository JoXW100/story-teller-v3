import { useContext } from 'react'
import { Context } from 'components/contexts/variable'
import VariableElement, { type VariableElementParams } from 'structure/elements/variable'

const VariableComponent: React.FC<VariableElementParams> = ({ name, fallback, format }) => {
    const [variables] = useContext(Context)
    if (!(name in variables) && fallback === null) {
        return null
    }
    const value = name in variables ? variables[name] : fallback!
    const text = format !== null
        ? format.replace('@', value)
        : value
    return <span>{text}</span>
}

export const element = {
    'var': new VariableElement(({ key, ...params }) => <VariableComponent key={key} {...params}/>)
}

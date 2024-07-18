import React from 'react'

type VariableContextProvider = [variables: Record<string, string>]

export const Context = React.createContext<VariableContextProvider>([{}])

type VariableContextProps = React.PropsWithChildren<{
    variables: Record<string, string>
}>

const VariableContext: React.FC<VariableContextProps> = ({ children, variables }) => {
    return (
        <Context.Provider value={[variables]}>
            { children }
        </Context.Provider>
    )
}

export default VariableContext

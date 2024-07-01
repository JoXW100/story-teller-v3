import { useContext, useMemo } from 'react'
import { Context } from 'components/contexts/file'
import Elements, { ElementDictionary } from 'components/elements'

const DefaultRenderer: React.FC = () => {
    const [context] = useContext(Context)
    const description = useMemo(() => context.file.getTokenizedDescription(ElementDictionary), [context.file])

    return <>
        <Elements.h1 underline>{context.file.getTitle()}</Elements.h1>
        { description.build() }
    </>
}

export default DefaultRenderer

import { useContext, useMemo } from 'react'
import type { LinkRendererProps } from '.'
import { Context } from 'components/contexts/file'
import Elements, { ElementDictionary } from 'components/elements'

export const DefaultRenderer: React.FC = () => {
    const [context] = useContext(Context)
    const description = useMemo(() => context.file.getTokenizedDescription(ElementDictionary), [context.file])

    return <>
        <Elements.h1 underline={false}>{context.file.getTitle()}</Elements.h1>
        { description.build() }
    </>
}

export const DefaultLinkRenderer: React.FC<LinkRendererProps> = ({ file }) => {
    const description = useMemo(() => file.getTokenizedDescription(ElementDictionary), [file])

    return <>
        <Elements.h4 underline={false}>{file.getTitle()}</Elements.h4>
        { description.build() }
    </>
}

export default DefaultRenderer

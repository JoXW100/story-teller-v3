import { useContext, useMemo } from 'react'
import type { LinkRendererProps } from '.'
import { Context } from 'components/contexts/file'
import Elements, { ElementDictionary } from 'components/elements'

export const DefaultRenderer: React.FC = () => {
    const [context] = useContext(Context)
    return <DefaultLinkRenderer file={context.file}/>
}

export const DefaultLinkRenderer: React.FC<LinkRendererProps> = ({ file }) => {
    const description = useMemo(() => file.getTokenizedDescription(ElementDictionary), [file])

    return <>
        <Elements.h3 underline={false}>{file.getTitle()}</Elements.h3>
        { description.build() }
    </>
}

export default DefaultRenderer

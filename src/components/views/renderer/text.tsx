import { useContext, useMemo } from 'react'
import { Context } from 'components/contexts/file'
import Elements, { ElementDictionary } from 'components/elements'
import TextData from 'structure/database/files/text/data'
import StoryScript from 'structure/language/storyscript'

const TextDocumentRenderer: React.FC = (): React.ReactNode => {
    const [context] = useContext(Context)
    const contentToken = useMemo(() => {
        if (context.file.data instanceof TextData) {
            const [, content] = context.file.data.createContexts(ElementDictionary)
            return StoryScript.tokenize(ElementDictionary, context.file.data.content, content).root
        } else {
            return null
        }
    }, [context.file.data])
    const title = context.file.getTitle()

    return <>
        <Elements.h1 underline={true}>{title}</Elements.h1>
        { contentToken?.build() }
    </>
}

export default TextDocumentRenderer

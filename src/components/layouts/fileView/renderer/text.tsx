import { useContext, useMemo } from 'react'
import { Context } from 'components/contexts/file'
import { ElementDictionary } from 'components/elements'
import { isDefined } from 'utils'
import TextDocument from 'structure/database/files/text'
import StoryScript from 'structure/language/storyscript'

const TextDocumentRenderer: React.FC = (): React.ReactNode => {
    const [context] = useContext(Context)
    const contentToken = useMemo(() => {
        if (isDefined(context.tokens.content)) {
            return context.tokens.content
        } else if (context.file instanceof TextDocument) {
            const [, content] = context.file.data.createContexts(ElementDictionary)
            return StoryScript.tokenize(ElementDictionary, context.file.data.content, content).root
        } else {
            return null
        }
    }, [context.file, context.tokens.content])

    return contentToken?.build()
}

export default TextDocumentRenderer

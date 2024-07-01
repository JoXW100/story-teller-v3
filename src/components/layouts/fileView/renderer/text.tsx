import { useContext } from 'react'
import { Context } from 'components/contexts/file'

const TextDocumentRenderer: React.FC = (): React.ReactNode => {
    const [context] = useContext(Context)

    return context.tokens.content?.build()
}

export default TextDocumentRenderer

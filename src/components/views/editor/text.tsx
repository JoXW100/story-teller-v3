import { useContext } from 'react'
import { Context } from 'components/contexts/file'
import { ElementDictionary } from 'components/elements'
import TextEditor from 'components/controls/textEditor'
import LocalizedText from 'components/controls/localizedText'
import PublishComponent from './components/publish'
import GroupComponent from './components/group'
import TextComponent from './components/text'
import TextareaComponent from './components/textarea'
import TextDocument from 'structure/database/files/text'
import styles from './style.module.scss'

const TextDocumentEditor: React.FC = () => {
    const [context, dispatch] = useContext(Context)

    if (!(context.file instanceof TextDocument)) {
        return null
    }

    const [descriptionContext, contentContext] = context.file.data.createContexts(ElementDictionary)

    return (
        <div className={styles.main}>
            <GroupComponent header={<LocalizedText id='editor-header-data'/>} open>
                <PublishComponent/>
                <TextComponent field='title' labelId='editor-title'/>
                <TextareaComponent field='description' labelId='editor-description' languageContext={descriptionContext}/>
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-content'/>} open fill>
                <TextEditor
                    value={context.file.data.content}
                    className={styles.editTextEditor}
                    context={contentContext}
                    onMount={(token) => { dispatch.setToken('content', token) }}
                    onChange={(text, token) => {
                        dispatch.setData('content', text)
                        dispatch.setToken('content', token)
                    }}/>
            </GroupComponent>
        </div>
    )
}

export default TextDocumentEditor

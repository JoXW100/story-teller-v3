import { useContext } from 'react'
import { Context } from 'components/contexts/file'
import { ElementDictionary } from 'components/elements'
import TextEditor from 'components/controls/textEditor'
import PublishComponent from './components/publish'
import GroupComponent from './components/group'
import LocalizedText from 'components/controls/localizedText'
import TextComponent from './components/text'
import LinkComponent from './components/link'
import ModifiersInputComponent from './components/modifiersInput'
import TextareaComponent from './components/textarea'
import { DocumentType } from 'structure/database'
import SubraceDocument from 'structure/database/files/subrace'
import styles from './style.module.scss'

const SubraceDocumentEditor: React.FC = () => {
    const [context, dispatch] = useContext(Context)

    if (!(context.file instanceof SubraceDocument)) {
        return null
    }

    const data = context.file.data
    const [descriptionContext, contentContext] = data.createContexts(ElementDictionary)

    return (
        <div className={styles.main}>
            <GroupComponent header={<LocalizedText id='editor-header-data'/>} open>
                <PublishComponent/>
                <TextComponent field='name' labelId='editor-name'/>
                <TextareaComponent
                    field='description'
                    labelId='editor-description'
                    languageContext={descriptionContext}/>
                <LinkComponent
                    field='parentFile'
                    labelId='editor-parentRace'
                    placeholderId='editor-race-placeholder'
                    allowedTypes={[DocumentType.Race]}/>
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-modifiers'/>} open>
                <ModifiersInputComponent field='modifiers' fill/>
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-content'/>} open fill>
                <TextEditor
                    value={context.file.data.content}
                    className={styles.editTextEditor}
                    context={contentContext}
                    onChange={(text) => { dispatch.setData('content', text) }}/>
            </GroupComponent>
        </div>
    )
}

export default SubraceDocumentEditor

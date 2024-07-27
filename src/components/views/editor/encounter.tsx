import { useContext } from 'react'
import TextEditor from 'components/controls/textEditor'
import { Context } from 'components/contexts/file'
import PublishComponent from './components/publish'
import GroupComponent from './components/group'
import LocalizedText from 'components/controls/localizedText'
import TextComponent from './components/text'
import NumberComponent from './components/number'
import LinkRecordComponent from './components/linkRecord'
import TextareaComponent from './components/textarea'
import { ElementDictionary } from 'components/elements'
import { DocumentType } from 'structure/database'
import EncounterDocument from 'structure/database/files/encounter'
import styles from './style.module.scss'

const EncounterDocumentEditor: React.FC = () => {
    const [context, dispatch] = useContext(Context)

    if (!(context.file instanceof EncounterDocument)) {
        return null
    }

    const [descriptionContext, contentContext] = context.file.data.createContexts(ElementDictionary)

    return (
        <div className={styles.main}>
            <GroupComponent header={<LocalizedText id='editor-header-data'/>} open>
                <PublishComponent/>
                <TextComponent field='name' labelId='editor-name'/>
                <TextareaComponent field='description' labelId='editor-description' languageContext={descriptionContext}/>
                <NumberComponent field='challenge' labelId='editor-challenge'/>
                <NumberComponent field='xp' labelId='editor-xp'/>
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-creatures'/>} open>
                <LinkRecordComponent
                    field='creatures'
                    labelId='editor-creatures'
                    placeholderId='editor-creatures-placeholder'
                    type='number'
                    defaultValue={1}
                    allowedTypes={[DocumentType.Character, DocumentType.Creature]}
                    fill />
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

export default EncounterDocumentEditor

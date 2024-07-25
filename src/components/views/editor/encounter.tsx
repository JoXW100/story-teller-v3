import { useContext } from 'react'
import TextEditor from 'components/controls/textEditor'
import { Context } from 'components/contexts/file'
import PublishComponent from './components/publish'
import GroupComponent from './components/group'
import LocalizedText from 'components/controls/localizedText'
import TextComponent from './components/text'
import NumberComponent from './components/number'
import LinkRecordComponent from './components/linkRecord'
import { ElementDictionary } from 'components/elements'
import { DocumentType } from 'structure/database'
import EncounterDocument from 'structure/database/files/encounter'
import styles from './style.module.scss'

const EncounterDocumentEditor: React.FC = () => {
    const [context, dispatch] = useContext(Context)

    if (!(context.file instanceof EncounterDocument)) {
        return null
    }

    const [descriptionContext] = context.file.data.createContexts(ElementDictionary)

    return (
        <div className={styles.main}>
            <GroupComponent header={<LocalizedText id='editor-header-data'/>} open>
                <PublishComponent/>
                <TextComponent field='name' labelId='editor-name'/>
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
            <GroupComponent header={<LocalizedText id='editor-header-description'/>} open fill>
                <TextEditor
                    value={context.file.data.description}
                    className={styles.editTextEditor}
                    context={descriptionContext}
                    onMount={(token) => { dispatch.setToken('description', token) }}
                    onChange={(text, token) => {
                        dispatch.setData('description', text)
                        dispatch.setToken('description', token)
                    }}/>
            </GroupComponent>
        </div>
    )
}

export default EncounterDocumentEditor

import { useContext } from 'react'
import { Context } from 'components/contexts/file'
import PublishComponent from './components/publish'
import GroupComponent from './components/group'
import LocalizedText from 'components/controls/localizedText'
import TextComponent from './components/text'
import TextareaComponent from './components/textarea'
import EnumComponent from './components/enum'
import TextEditor from 'components/controls/textEditor'
import { ElementDictionary } from 'components/elements'
import NPCDocument from 'structure/database/files/npc'
import styles from './style.module.scss'

const NPCDocumentEditor: React.FC = () => {
    const [context, dispatch] = useContext(Context)

    if (!(context.file instanceof NPCDocument)) {
        return null
    }

    const [descriptionContext, contentContext] = context.file.data.createContexts(ElementDictionary)

    return (
        <div className={styles.main}>
            <GroupComponent header={<LocalizedText id='editor-header-data'/>} open>
                <PublishComponent/>
                <TextComponent field='name' labelId='editor-name'/>
                <TextareaComponent
                    field='description'
                    labelId='editor-description'
                    languageContext={descriptionContext}/>
                <TextComponent field='portrait' labelId='editor-portrait'/>
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-info'/>} open>
                <TextComponent field='race' labelId='editor-raceName'/>
                <EnumComponent field='size' type='size' labelId='editor-size'/>
                <EnumComponent field='type' type='creatureType' labelId='editor-type'/>
                <EnumComponent field='alignment' type='alignment' labelId='editor-alignment'/>
                <TextComponent field='gender' labelId='editor-gender'/>
                <TextComponent field='age' labelId='editor-age'/>
                <TextComponent field='height' labelId='editor-height'/>
                <TextComponent field='weight' labelId='editor-weight'/>
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

export default NPCDocumentEditor

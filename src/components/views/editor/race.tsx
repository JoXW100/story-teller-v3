import { useContext } from 'react'
import TextEditor from 'components/controls/textEditor'
import { Context } from 'components/contexts/file'
import PublishComponent from './components/publish'
import GroupComponent from './components/group'
import LocalizedText from 'components/controls/localizedText'
import TextComponent from './components/text'
import EnumComponent from './components/enum'
import SelectionInputComponent from './components/selectionInput'
import LinkListComponent from './components/linkList'
import { ElementDictionary } from 'components/elements'
import { DocumentType } from 'structure/database'
import RaceDocument from 'structure/database/files/race'
import styles from './style.module.scss'
import TextareaComponent from './components/textarea'

const RaceDocumentEditor: React.FC = () => {
    const [context, dispatch] = useContext(Context)

    if (!(context.file instanceof RaceDocument)) {
        return null
    }

    const [descriptionContext, contentContext] = context.file.data.createContexts(ElementDictionary)

    return (
        <div className={styles.main}>
            <GroupComponent header={<LocalizedText id='editor-header-data'/>} open>
                <PublishComponent/>
                <TextComponent field='name' labelId='editor-name'/>
                <TextareaComponent field='description' labelId='editor-description' languageContext={descriptionContext}/>
                <EnumComponent field='type' type='creatureType' labelId='editor-type'/>
                <EnumComponent field='size' type='size' labelId='editor-size'/>
                <SelectionInputComponent
                    field='speed'
                    type='number'
                    optionsType='movement'
                    labelId='editor-speed'/>
                <SelectionInputComponent
                    field='senses'
                    type='number'
                    optionsType='sense'
                    labelId='editor-senses'/>
                <SelectionInputComponent
                    field='languages'
                    type='enum'
                    optionsType='language'
                    editOptionsType='proficiencyLevelBasic'
                    labelId='editor-proficiencies-language' />
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-modifiers'/>} open>
                <LinkListComponent
                    field='modifiers'
                    labelId='editor-modifiers'
                    placeholderId='editor-modifiers-placeholder'
                    allowedTypes={[DocumentType.Modifier]}
                    fill/>
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-abilities'/>} open>
                <LinkListComponent
                    field='abilities'
                    labelId='editor-abilities'
                    placeholderId='editor-abilities-placeholder'
                    allowedTypes={[DocumentType.Ability]}
                    allowText
                    fill/>
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

export default RaceDocumentEditor

import { useContext } from 'react'
import { Context } from 'components/contexts/file'
import { ElementDictionary } from 'components/elements'
import TextEditor from 'components/textEditor'
import GroupComponent from './components/group'
import LocalizedText from 'components/localizedText'
import TextComponent from './components/text'
import LinkComponent from './components/link'
import LinkListComponent from './components/linkList'
import { DocumentType } from 'structure/database'
import SubraceDocument from 'structure/database/files/subrace'
import styles from './style.module.scss'

const SubraceDocumentEditor: React.FC = () => {
    const [context, dispatch] = useContext(Context)

    if (!(context.file instanceof SubraceDocument)) {
        return null
    }

    const data = context.file.data
    const [descriptionContext] = data.createContexts(ElementDictionary)

    return (
        <div className={styles.main}>
            <GroupComponent header={<LocalizedText id='editor-header-data'/>} open>
                <TextComponent field='name' labelId='editor-name'/>
                <LinkComponent field='parentRace' labelId='editor-parentRace' allowedTypes={[DocumentType.Race]}/>
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
            <GroupComponent header={<LocalizedText id='editor-header-description'/>} open fill>
                <TextEditor
                    value={data.description}
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

export default SubraceDocumentEditor

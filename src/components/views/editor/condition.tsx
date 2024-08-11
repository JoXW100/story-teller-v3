import { useContext } from 'react'
import TextEditor from 'components/controls/textEditor'
import { Context } from 'components/contexts/file'
import PublishComponent from './components/publish'
import GroupComponent from './components/group'
import LocalizedText from 'components/controls/localizedText'
import TextComponent from './components/text'
import ModifiersInputComponent from './components/modifiersInput'
import { ElementDictionary } from 'components/elements'
import ConditionDocument from 'structure/database/files/condition'
import styles from './style.module.scss'

const ConditionDocumentEditor: React.FC = () => {
    const [context, dispatch] = useContext(Context)

    if (!(context.file instanceof ConditionDocument)) {
        return null
    }

    const [descriptionContext] = context.file.data.createDescriptionContexts(ElementDictionary)

    return (
        <div className={styles.main}>
            <GroupComponent header={<LocalizedText id='editor-header-data'/>} open>
                <PublishComponent/>
                <TextComponent field='name' labelId='editor-name'/>
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-modifiers'/>} open>
                <ModifiersInputComponent field='modifiers' fill/>
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-description'/>} open fill>
                <TextEditor
                    value={context.file.data.description}
                    className={styles.editTextEditor}
                    context={descriptionContext}
                    onChange={(text) => { dispatch.setData('description', text) }}/>
            </GroupComponent>
        </div>
    )
}

export default ConditionDocumentEditor

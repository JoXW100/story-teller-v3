import { useContext } from 'react'
import { Context, getRelativeFieldObject } from 'components/contexts/file'
import GroupComponent from './components/group'
import LocalizedText from 'components/localizedText'
import NavigationComponent from './components/navigation'
import { isInnerModifierData } from 'structure/database/files/modifier/choice'
import styles from './style.module.scss'
import ConditionComponent from './components/condition'
import LinkListComponent from './components/linkList'
import { DocumentType } from 'structure/database'

const AllowedTypes = [DocumentType.Modifier] as const
const InnerModifierEditor: React.FC = () => {
    const [context, dispatch] = useContext(Context)
    const page = context.editorPages[context.editorPages.length - 1]
    const field = page?.root
    const deps = page?.deps ?? []
    const relative = getRelativeFieldObject(field, context.file.data)
    const data = relative?.relative[relative.key]

    if (!isInnerModifierData(data)) {
        dispatch.popEditorPage()
        return null
    }

    return (
        <div className={styles.main}>
            <NavigationComponent/>
            <GroupComponent header={<LocalizedText id='editor-header-data'/>} open>
                <ConditionComponent field={`${field}.condition`} labelId='editor-condition' deps={deps} />
                <LinkListComponent field={`${field}.modifiers`} labelId='editor-modifiers' allowedTypes={AllowedTypes} deps={deps}/>
            </GroupComponent>
        </div>
    )
}

export default InnerModifierEditor

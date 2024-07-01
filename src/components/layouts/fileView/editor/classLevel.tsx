import { useContext } from 'react'
import { Context, getRelativeFieldObject } from 'components/contexts/file'
import { OptionalAttribute } from 'structure/dnd'
import GroupComponent from './components/group'
import LocalizedText from 'components/localizedText'
import EnumComponent from './components/enum'
import LinkListComponent from './components/linkList'
import SelectionInputComponent from './components/selectionInput'
import NumberComponent from './components/number'
import NavigationComponent from './components/navigation'
import ClassLevelData from 'structure/database/files/class/levelData'
import { DocumentType } from 'structure/database'
import styles from './style.module.scss'

const ClassLevelEditor: React.FC = () => {
    const [context, dispatch] = useContext(Context)
    const page = context.editorPages[context.editorPages.length - 1]
    const field = page?.root
    const deps = page?.deps ?? []
    const relative = getRelativeFieldObject(field, context.file.data)
    const data = relative?.relative[relative.key]

    if (!(data instanceof ClassLevelData)) {
        dispatch.popEditorPage()
        return null
    }

    return (
        <div className={styles.main}>
            <NavigationComponent/>
            <GroupComponent header={<LocalizedText id='editor-header-modifiers'/>} open>
                <LinkListComponent field={`${field}.modifiers`} allowedTypes={[DocumentType.Modifier]} labelId='editor-modifiers'/>
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-abilities'/>} open>
                <LinkListComponent
                    field={`${field}.abilities`}
                    allowedTypes={[DocumentType.Ability]}
                    labelId='editor-abilities'
                    placeholderId='editor-abilities-placeholder'
                    allowText/>
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-spells'/>} open>
                <EnumComponent field={`${field}.spellAttribute`} type='optionalAttr' labelId='editor-spellAttribute'/>
                { data.spellAttribute !== OptionalAttribute.None &&
                    <>
                        <EnumComponent field={`${field}.type`} type='levelModifyType' labelId='editor-modifyType'/>
                        <SelectionInputComponent
                            field={`${field}.spellSlots`}
                            type='number'
                            labelId='editor-spellSlots'
                            optionsType='spellLevel'
                            deps={[...deps, `${field}.spellAttribute`]}/>
                        <NumberComponent field={`${field}.preparationSlots`} labelId='editor-preparationSlots' />
                        <NumberComponent field={`${field}.learnedSlots`} labelId='editor-learnedSlots' />
                    </>
                }
            </GroupComponent>
        </div>
    )
}

export default ClassLevelEditor

import { useContext } from 'react'
import { Context } from 'components/contexts/file'
import { ElementDictionary } from 'components/elements'
import TextEditor from 'components/textEditor'
import GroupComponent from './components/group'
import LocalizedText from 'components/localizedText'
import TextComponent from './components/text'
import EnumComponent from './components/enum'
import BooleanComponent from './components/boolean'
import GroupItemComponent from './components/groupItem'
import LinkComponent from './components/link'
import EditItemButtonComponent from './components/editItemButton'
import { ClassLevel } from 'structure/dnd'
import { getOptionType } from 'structure/optionData'
import { DocumentType } from 'structure/database'
import SubclassDocument from 'structure/database/files/subclass'
import styles from './style.module.scss'

const SubclassDocumentEditor: React.FC = () => {
    const [context, dispatch] = useContext(Context)

    if (!(context.file instanceof SubclassDocument)) {
        return null
    }

    const data = context.file.data
    const option = getOptionType('classLevel')
    const [descriptionContext] = data.createContexts(ElementDictionary)

    return (
        <div className={styles.main}>
            <GroupComponent header={<LocalizedText id='editor-header-data'/>} open>
                <TextComponent field='name' labelId='editor-name'/>
                <LinkComponent field='parentClass' labelId='editor-parentClass' allowedTypes={[DocumentType.Class]}/>
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-levels'/>} open>
                { Object.values(ClassLevel).map((level) => (
                    <GroupItemComponent key={level} labelId='empty' labelArgs={[option.options[level]]}>
                        <span className={styles.classLevelRow}>
                            <EditItemButtonComponent pageKey='classLevel' root={`levels.${level}`} name={option.options[level]} />
                        </span>
                    </GroupItemComponent>
                ))}
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-spells'/>} open>
                <EnumComponent field='spellAttribute' type='optionalAttr' labelId='editor-spellAttribute'/>
                <GroupComponent header={<LocalizedText id='editor-header-preparedSpells'/>} open>
                    <BooleanComponent field='preparationAll' labelId='editor-preparationAll' />
                    { !data.preparationAll &&
                        <EnumComponent field='preparationSlotsScaling' type='optionalAttr' labelId='editor-preparationSlotsScaling' />
                    }
                </GroupComponent>
                <GroupComponent header={<LocalizedText id='editor-header-learnedSpells'/>} open>
                    <BooleanComponent field='learnedAll' labelId='editor-learnedAll' />
                    { !data.learnedAll &&
                        <EnumComponent field='learnedSlotsScaling' type='optionalAttr' labelId='editor-learnedSlotsScaling' />
                    }
                </GroupComponent>
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

export default SubclassDocumentEditor

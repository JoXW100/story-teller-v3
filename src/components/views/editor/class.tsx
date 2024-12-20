import { useContext } from 'react'
import { Context } from 'components/contexts/file'
import { ElementDictionary } from 'components/elements'
import TextEditor from 'components/controls/textEditor'
import PublishComponent from './components/publish'
import GroupComponent from './components/group'
import LocalizedText from 'components/controls/localizedText'
import TextComponent from './components/text'
import EnumComponent from './components/enum'
import BooleanComponent from './components/boolean'
import GroupItemComponent from './components/groupItem'
import EditItemButtonComponent from './components/editItemButton'
import SelectionInputComponent from './components/selectionInput'
import { useLocalizedEnums } from 'utils/hooks/localization'
import { ClassLevel } from 'structure/dnd'
import ClassDocument from 'structure/database/files/class'
import styles from './style.module.scss'
import TextareaComponent from './components/textarea'

const ClassDocumentEditor: React.FC = () => {
    const [context, dispatch] = useContext(Context)
    const options = useLocalizedEnums('classLevel')

    if (!(context.file instanceof ClassDocument)) {
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
                <EnumComponent field='hitDie' labelId='editor-hitDie' type='die'/>
                <EnumComponent field='subclassLevel' labelId='editor-subclassLevel' type='classLevel'/>
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-levels'/>} open>
                { Object.values(ClassLevel).map((level) => (
                    <GroupItemComponent key={level} labelId='empty' labelArgs={[options[level]]}>
                        <span>
                            <EditItemButtonComponent
                                pageKey='classLevel'
                                root={`levels.${level}`}
                                name={options[level]} />
                        </span>
                    </GroupItemComponent>
                )) }
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-proficiencies'/>} open>
                <SelectionInputComponent
                    field='proficienciesSave'
                    type='enum'
                    optionsType='attr'
                    editOptionsType='proficiencyLevel'
                    labelId='editor-proficiencies-save'
                    fill/>
                <SelectionInputComponent
                    field='proficienciesTool'
                    type='enum'
                    optionsType='tool'
                    editOptionsType='proficiencyLevel'
                    labelId='editor-proficiencies-tool'
                    fill/>
                <SelectionInputComponent
                    field='proficienciesArmor'
                    type='enum'
                    optionsType='armor'
                    editOptionsType='proficiencyLevelBasic'
                    labelId='editor-proficiencies-armor'
                    fill/>
                <SelectionInputComponent
                    field='proficienciesWeapon'
                    type='enum'
                    optionsType='weaponTypeValue'
                    editOptionsType='proficiencyLevelBasic'
                    labelId='editor-proficiencies-weapon'
                    fill/>
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-spells'/>} open>
                <EnumComponent field='spellAttribute' type='optionalAttr' labelId='editor-spellAttribute'/>
                <GroupComponent header={<LocalizedText id='editor-header-preparedSpells'/>} open>
                    <BooleanComponent field='preparationAll' labelId='editor-preparationAll' />
                    { !data.preparationAll &&
                        <EnumComponent
                            field='preparationSlotsScaling'
                            type='optionalAttr'
                            labelId='editor-preparationSlotsScaling' />
                    }
                </GroupComponent>
                <GroupComponent header={<LocalizedText id='editor-header-learnedSpells'/>} open>
                    <BooleanComponent field='learnedAll' labelId='editor-learnedAll' />
                    { !data.learnedAll &&
                        <EnumComponent
                            field='learnedSlotsScaling'
                            type='optionalAttr'
                            labelId='editor-learnedSlotsScaling' />
                    }
                </GroupComponent>
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-content'/>} open fill>
                <TextEditor
                    value={data.content}
                    className={styles.editTextEditor}
                    context={contentContext}
                    onChange={(text) => { dispatch.setData('content', text) }}/>
            </GroupComponent>
        </div>
    )
}

export default ClassDocumentEditor

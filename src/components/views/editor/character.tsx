import { useContext } from 'react'
import { Context } from 'components/contexts/file'
import PublishComponent from './components/publish'
import GroupComponent from './components/group'
import LocalizedText from 'components/controls/localizedText'
import TextComponent from './components/text'
import TextareaComponent from './components/textarea'
import EnumComponent from './components/enum'
import NumberComponent from './components/number'
import CalcComponent from './components/calc'
import SelectionInputComponent from './components/selectionInput'
import SubclassesInputComponent from './components/subclassesInput'
import LinkListComponent from './components/linkList'
import LinkComponent from './components/link'
import LinkRecordComponent from './components/linkRecord'
import BindingInputComponent from './components/bindingInput'
import TextEditor from 'components/controls/textEditor'
import { ElementDictionary } from 'components/elements'
import { OptionalAttribute } from 'structure/dnd'
import { DocumentType } from 'structure/database'
import CharacterDocument from 'structure/database/files/character'
import styles from './style.module.scss'

const CharacterDocumentEditor: React.FC = () => {
    const [context, dispatch] = useContext(Context)

    if (!(context.file instanceof CharacterDocument)) {
        return null
    }

    const [descriptionContext, contentContext] = context.file.data.createContexts(ElementDictionary)
    const hasClass = Object.keys(context.file.data.classes).length > 0

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
                <LinkComponent
                    field='race'
                    labelId='editor-race'
                    placeholderId='editor-race-placeholder'
                    allowedTypes={[DocumentType.Race]}/>
                { context.file.data.race !== null &&
                    <LinkComponent
                        field='subrace'
                        labelId='editor-subrace'
                        placeholderId='editor-subrace-placeholder'
                        parentFile={context.file.data.race}
                        allowedTypes={[DocumentType.Subrace]}/>
                }{ context.file.data.race === null &&
                    <>
                        <TextComponent field='raceName' labelId='editor-raceName'/>
                        <EnumComponent field='size' type='size' labelId='editor-size'/>
                        <EnumComponent field='type' type='creatureType' labelId='editor-type'/>
                    </>
                }
                <LinkRecordComponent
                    field='classes'
                    labelId='editor-classes'
                    placeholderId='editor-classes-placeholder'
                    type='enum'
                    enumType='classLevel'
                    defaultValue={1}
                    allowedTypes={[DocumentType.Class]}
                    fill/>
                <SubclassesInputComponent data={context.file.data} fill/>
                <EnumComponent field='alignment' type='alignment' labelId='editor-alignment'/>
                <TextComponent field='gender' labelId='editor-gender'/>
                <TextComponent field='age' labelId='editor-age'/>
                <TextComponent field='height' labelId='editor-height'/>
                <TextComponent field='weight' labelId='editor-weight'/>
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-stats'/>} open>
                { !hasClass &&
                    <NumberComponent field='level' labelId='editor-level'/>
                }
                { !hasClass &&
                    <EnumComponent field='hitDie' type='die' labelId='editor-hitDie'/>
                }
                <CalcComponent field='health' labelId='editor-health'/>
                <CalcComponent field='ac' labelId='editor-ac'/>
                <CalcComponent field='proficiency' labelId='editor-proficiency'/>
                <SelectionInputComponent
                    field='speed'
                    type='number'
                    optionsType='movement'
                    labelId='editor-speed'
                    fill/>
                <SelectionInputComponent
                    field='senses'
                    type='number'
                    optionsType='sense'
                    labelId='editor-senses'
                    fill/>
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-attributes'/>} open>
                <NumberComponent field='str' labelId='editor-str'/>
                <NumberComponent field='dex' labelId='editor-dex'/>
                <NumberComponent field='con' labelId='editor-con'/>
                <NumberComponent field='int' labelId='editor-int'/>
                <NumberComponent field='wis' labelId='editor-wis'/>
                <NumberComponent field='cha' labelId='editor-cha'/>
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-passives'/>} open>
                <CalcComponent field='passivePerception' labelId='editor-passivePerception'/>
                <CalcComponent field='passiveInvestigation' labelId='editor-passiveInvestigation'/>
                <CalcComponent field='passiveInsight' labelId='editor-passiveInsight'/>
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
                    field='proficienciesSkill'
                    type='enum'
                    optionsType='skill'
                    editOptionsType='proficiencyLevel'
                    labelId='editor-proficiencies-skill'
                    fill/>
                <SelectionInputComponent
                    field='proficienciesLanguage'
                    type='enum'
                    optionsType='language'
                    editOptionsType='proficiencyLevelBasic'
                    labelId='editor-proficiencies-language'
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
            <GroupComponent header={<LocalizedText id='editor-header-advantages'/>} open>
                <BindingInputComponent
                    field='advantages'
                    type='advantageBinding'
                    labelId='editor-advantages'
                    fill/>
                <BindingInputComponent
                    field='disadvantages'
                    type='advantageBinding'
                    labelId='editor-disadvantages'
                    fill/>
                <BindingInputComponent
                    field='resistances'
                    type='damageBinding'
                    labelId='editor-resistances'
                    fill/>
                <BindingInputComponent
                    field='vulnerabilities'
                    type='damageBinding'
                    labelId='editor-vulnerabilities'
                    fill/>
                <BindingInputComponent
                    field='damageImmunities'
                    type='damageBinding'
                    labelId='editor-damageImmunities'
                    fill/>
                <BindingInputComponent
                    field='conditionImmunities'
                    type='conditionBinding'
                    labelId='editor-conditionImmunities'
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
            <GroupComponent header={<LocalizedText id='editor-header-spells'/>} open>
                <CalcComponent field='casterLevel' labelId='editor-casterLevel'/>
                <LinkRecordComponent
                    field='spells'
                    labelId='editor-spells'
                    type='enum'
                    enumType='optionalAttr'
                    allowedTypes={[DocumentType.Spell]}
                    defaultValue={OptionalAttribute.None}
                    fill/>
                <SelectionInputComponent
                    field='spellSlots'
                    type='number'
                    labelId='editor-spellSlots'
                    optionsType='spellLevel'/>
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

export default CharacterDocumentEditor

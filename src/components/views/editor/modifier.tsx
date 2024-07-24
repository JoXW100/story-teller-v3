import { useContext } from 'react'
import TextEditor from 'components/controls/textEditor'
import { Context } from 'components/contexts/file'
import LocalizedText from 'components/controls/localizedText'
import GroupComponent from './components/group'
import TextComponent from './components/text'
import EnumComponent from './components/enum'
import NumberComponent from './components/number'
import ChoiceComponent from './components/choice'
import ConditionComponent from './components/condition'
import { ElementDictionary } from 'components/elements'
import EditItemRecordComponent from './components/editItemRecord'
import SelectionInputComponent from './components/selectionInput'
import LinkComponent from './components/link'
import NavigationComponent from './components/navigation'
import { createField, getRelativeFieldObject } from 'utils'
import { DocumentType } from 'structure/database'
import { ModifierType } from 'structure/database/files/modifier/common'
import { ModifierAddType } from 'structure/database/files/modifier/add'
import { ModifierAbilityType } from 'structure/database/files/modifier/ability'
import { ModifierSetType } from 'structure/database/files/modifier/set'
import { ModifierBonusType } from 'structure/database/files/modifier/bonus'
import { ModifierVariableType } from 'structure/database/files/modifier/variable'
import ModifierDataBase from 'structure/database/files/modifier/data'
import type { ModifierData } from 'structure/database/files/modifier/factory'
import ModifierDataFactory from 'structure/database/files/modifier/factory'
import styles from './style.module.scss'

function isModifierData(data: unknown): data is ModifierData {
    return data instanceof ModifierDataBase
}

const AllowedTypes = [DocumentType.Modifier] as const
const ModifierDocumentEditor: React.FC = () => {
    const [context, dispatch] = useContext(Context)
    const page = context.editorPages[context.editorPages.length - 1]
    const field = page?.root
    let data
    if (field === 'data') {
        data = context.file.data
    } else {
        const relative = getRelativeFieldObject(field, context.file.data)
        data = relative?.relative[relative.key]
    }

    if (!isModifierData(data)) {
        return null
    }

    const [descriptionContext] = data.createContexts(ElementDictionary)

    return (
        <div className={styles.main}>
            { field !== 'data' &&
                <NavigationComponent/>
            }
            <GroupComponent header={<LocalizedText id='editor-header-data'/>} open>
                <TextComponent field={createField(field, 'name')} labelId='editor-name' />
                <EnumComponent field={createField(field, 'type')} type='modifierType' labelId='editor-type' />
                { data.type === ModifierType.Ability &&
                    <>
                        <EnumComponent field={createField(field, 'subtype')} type='modifierAbilityType' labelId='editor-subtype'/>
                        { (data.subtype === ModifierAbilityType.AttackBonus || data.subtype === ModifierAbilityType.MeleeWeaponAttackBonus || data.subtype === ModifierAbilityType.RangedWeaponAttackBonus || data.subtype === ModifierAbilityType.ThrownWeaponAttackBonus) &&
                            <NumberComponent field={createField(field, 'value')} labelId='editor-value' allowNegative/>
                        }
                    </>
                }
                { data.type === ModifierType.Add &&
                    <>
                        <EnumComponent field={createField(field, 'subtype')} type='modifierAddType' labelId='editor-subtype'/>
                        { data.subtype === ModifierAddType.Ability &&
                            <ChoiceComponent field={createField(field, 'value')} type='abilityObjectId' allowMultipleChoices fill/>
                        }{ data.subtype === ModifierAddType.Spell &&
                            <ChoiceComponent field={createField(field, 'value')} type='spellObjectId' allowMultipleChoices fill/>
                        }{ data.subtype === ModifierAddType.Linked &&
                            <>
                                <TextComponent field={createField(field, 'category')} labelId='editor-category'/>
                                <NumberComponent field={createField(field, 'numChoices')} labelId='editor-numChoices'/>
                            </>
                        }{ (data.subtype === ModifierAddType.Advantage || data.subtype === ModifierAddType.Disadvantage) &&
                            <>
                                <ChoiceComponent field={createField(field, 'binding')} type='advantageBinding' fill/>
                                <TextComponent field={createField(field, 'notes')} labelId='editor-notes'/>
                            </>
                        }{ (data.subtype === ModifierAddType.Resistance || data.subtype === ModifierAddType.Vulnerability || data.subtype === ModifierAddType.DamageImmunity) &&
                            <>
                                <ChoiceComponent field={createField(field, 'binding')} type='damageBinding' fill/>
                                <TextComponent field={createField(field, 'notes')} labelId='editor-notes'/>
                            </>
                        }{ data.subtype === ModifierAddType.ConditionImmunity &&
                            <>
                                <ChoiceComponent field={createField(field, 'binding')} type='conditionBinding' fill/>
                                <TextComponent field={createField(field, 'notes')} labelId='editor-notes'/>
                            </>
                        }
                    </>
                }{ data.type === ModifierType.Remove &&
                    <LinkComponent field={createField(field, 'source')} labelId='editor-source' placeholderId='editor-modifier-placeholder' allowedTypes={AllowedTypes}/>
                }{ data.type === ModifierType.Bonus &&
                    <>
                        <EnumComponent field={createField(field, 'subtype')} type='modifierBonusType' labelId='editor-subtype' />
                        <SelectionInputComponent
                            field={createField(field, 'scaling')}
                            type='number'
                            optionsType='scaling'
                            labelId='editor-scaling'
                            fill/>
                        { data.subtype === ModifierBonusType.AbilityScore &&
                            <SelectionInputComponent
                                field={createField(field, 'attributes')}
                                type='number'
                                optionsType='attr'
                                labelId='editor-value'
                                fill/>
                        }{ data.subtype === ModifierBonusType.Save &&
                            <SelectionInputComponent
                                field={createField(field, 'saves')}
                                type='number'
                                optionsType='attr'
                                labelId='editor-value'
                                fill/>
                        }{ data.subtype === ModifierBonusType.Skill &&
                            <SelectionInputComponent
                                field={createField(field, 'skills')}
                                type='number'
                                optionsType='skill'
                                labelId='editor-value'
                                fill/>
                        }{ data.subtype === ModifierBonusType.Speed &&
                            <SelectionInputComponent
                                field={createField(field, 'types')}
                                type='number'
                                optionsType='movement'
                                labelId='editor-value'
                                fill/>
                        }
                    </>
                }{ data.type === ModifierType.Set &&
                    <>
                        <EnumComponent field={createField(field, 'subtype')} type='modifierSetType' labelId='editor-subtype' />
                        { data.subtype === ModifierSetType.SpellAttribute &&
                            <ChoiceComponent field={createField(field, 'value')} type='spellAttribute' fill/>
                        }{ data.subtype === ModifierSetType.Size &&
                            <ChoiceComponent field={createField(field, 'value')} type='size' fill/>
                        }{ data.subtype === ModifierSetType.Speed &&
                            <>
                                <SelectionInputComponent
                                    field={createField(field, 'scaling')}
                                    type='number'
                                    optionsType='scaling'
                                    labelId='editor-scaling'
                                    fill/>
                                <SelectionInputComponent
                                    field={createField(field, 'types')}
                                    type='number'
                                    optionsType='movement'
                                    labelId='editor-speed'
                                    fill/>
                            </>
                        }{ data.subtype === ModifierSetType.Sense &&
                            <>
                                <SelectionInputComponent
                                    field={createField(field, 'scaling')}
                                    type='number'
                                    optionsType='scaling'
                                    labelId='editor-scaling'
                                    fill/>
                                <SelectionInputComponent
                                    field={createField(field, 'senses')}
                                    type='number'
                                    optionsType='sense'
                                    labelId='editor-senses'
                                    fill/>
                            </>
                        }{ data.subtype === ModifierSetType.SaveProficiency &&
                            <>
                                <ChoiceComponent field={createField(field, 'proficiency')} type='attribute' allowMultipleChoices fill/>
                                <EnumComponent field={createField(field, 'value')} type='proficiencyLevel' labelId='editor-value' />
                            </>
                        }{ data.subtype === ModifierSetType.SkillProficiency &&
                            <>
                                <ChoiceComponent field={createField(field, 'proficiency')} type='skill' allowMultipleChoices fill/>
                                <EnumComponent field={createField(field, 'value')} type='proficiencyLevel' labelId='editor-value' />
                            </>
                        }{ data.subtype === ModifierSetType.ToolProficiency &&
                            <>
                                <ChoiceComponent field={createField(field, 'proficiency')} type='tool' allowMultipleChoices fill/>
                                <EnumComponent field={createField(field, 'value')} type='proficiencyLevel' labelId='editor-value' />
                            </>
                        }{ data.subtype === ModifierSetType.LanguageProficiency &&
                            <>
                                <ChoiceComponent field={createField(field, 'proficiency')} type='language' allowMultipleChoices fill/>
                                <EnumComponent field={createField(field, 'value')} type='proficiencyLevelBasic' labelId='editor-value' />
                            </>
                        }{ data.subtype === ModifierSetType.ArmorProficiency &&
                            <>
                                <ChoiceComponent field={createField(field, 'proficiency')} type='armor' allowMultipleChoices fill/>
                                <EnumComponent field={createField(field, 'value')} type='proficiencyLevelBasic' labelId='editor-value' />
                            </>
                        }{ data.subtype === ModifierSetType.WeaponProficiency &&
                            <>
                                <ChoiceComponent field={createField(field, 'proficiency')} type='weaponTypeValue' allowMultipleChoices fill/>
                                <EnumComponent field={createField(field, 'value')} type='proficiencyLevelBasic' labelId='editor-value' />
                            </>
                        }{ data.subtype === ModifierSetType.ArmorClassBase &&
                            <>
                                <SelectionInputComponent
                                    field={createField(field, 'values')}
                                    type='number'
                                    optionsType='scaling'
                                    labelId='editor-attributeMultipliers'
                                    fill/>
                                <SelectionInputComponent
                                    field={createField(field, 'maxValues')}
                                    type='number'
                                    optionsType='scaling'
                                    labelId='editor-maxAttributeValues'
                                    fill/>
                                <NumberComponent field={createField(field, 'bonus')} labelId='editor-bonus'/>
                            </>
                        }
                    </>
                }{ data.type === ModifierType.Choice &&
                    <>
                        <NumberComponent field={createField(field, 'num')} labelId='editor-numChoices' />
                        <EditItemRecordComponent
                            field={createField(field, 'options')}
                            labelId='editor-options'
                            defaultValue={ModifierDataFactory.create()}
                            page={DocumentType.Modifier}
                            fill/>
                    </>
                }{ data.type === ModifierType.Variable &&
                    <>
                        <EnumComponent field={createField(field, 'subtype')} type='modifierVariableType' labelId='editor-subtype' />
                        <TextComponent field={createField(field, 'variable')} labelId='editor-variable' />
                        <EnumComponent field={createField(field, 'operation')} type='operationType' labelId='editor-operation' />
                        { data.subtype === ModifierVariableType.Number &&
                            <ChoiceComponent field={createField(field, 'value')} type='number' fill/>
                        }
                        { data.subtype === ModifierVariableType.Collection &&
                            <ChoiceComponent field={createField(field, 'value')} type='string' allowMultipleChoices fill/>
                        }
                    </>
                }{ data.type === ModifierType.Group &&
                    <EditItemRecordComponent
                        field={createField(field, 'modifiers')}
                        labelId='editor-modifiers'
                        defaultValue={ModifierDataFactory.create()}
                        page={DocumentType.Modifier}
                        fill/>
                }
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-condition'/>} open>
                <ConditionComponent field={createField(field, 'condition')} labelId='editor-header-condition'/>
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-description'/>} open fill>
                <TextEditor
                    value={data.description}
                    className={styles.editTextEditor}
                    context={descriptionContext}
                    onMount={(token) => { dispatch.setToken(createField(field, 'description'), token) }}
                    onChange={(text, token) => {
                        dispatch.setData(createField(field, 'description'), text)
                        dispatch.setToken(createField(field, 'description'), token)
                    }}/>
            </GroupComponent>
        </div>
    )
}

export default ModifierDocumentEditor

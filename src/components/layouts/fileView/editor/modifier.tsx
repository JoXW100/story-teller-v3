import { useContext, useMemo } from 'react'
import TextEditor from 'components/textEditor'
import { Context } from 'components/contexts/file'
import LocalizedText from 'components/localizedText'
import GroupComponent from './components/group'
import TextComponent from './components/text'
import EnumComponent from './components/enum'
import NumberComponent from './components/number'
import ChoiceComponent from './components/choice'
import ConditionComponent from './components/condition'
import { ElementDictionary } from 'components/elements'
import EditItemRecordComponent from './components/editItemRecord'
import LinkComponent from './components/link'
import { DocumentType } from 'structure/database'
import ModifierDocument from 'structure/database/files/modifier'
import { ModifierType } from 'structure/database/files/modifier/common'
import { ModifierAddType } from 'structure/database/files/modifier/add'
import { ModifierAbilityType } from 'structure/database/files/modifier/ability'
import { ModifierSetType } from 'structure/database/files/modifier/set'
import ConditionFactory from 'structure/database/condition/factory'
import type { IInnerModifierData } from 'types/database/files/modifier'
import styles from './style.module.scss'

const AllowedTypes = [DocumentType.Modifier] as const
const ModifierDocumentEditor: React.FC = () => {
    const [context, dispatch] = useContext(Context)
    const defaultInnerModifierValue = useMemo<IInnerModifierData>(() => {
        return { condition: ConditionFactory.create(), modifiers: [] } satisfies IInnerModifierData
    }, [])

    if (!(context.file instanceof ModifierDocument)) {
        return null
    }

    const [descriptionContext] = context.file.data.createContexts(ElementDictionary)

    return (
        <div className={styles.main}>
            <GroupComponent header={<LocalizedText id='editor-header-data'/>} open>
                <TextComponent field='name' labelId='editor-name'/>
                <EnumComponent field='type' type='modifierType' labelId='editor-type'/>
                { context.file.data.type === ModifierType.Ability &&
                    <>
                        <EnumComponent field='subtype' type='modifierAbilityType' labelId='editor-subtype' deps={['type']}/>
                        { context.file.data.subtype === ModifierAbilityType.AttackBonus &&
                            <NumberComponent field='value' labelId='editor-value' deps={['type', 'subtype']} allowNegative/>
                        }
                    </>
                }
                { context.file.data.type === ModifierType.Add &&
                    <>
                        <EnumComponent field='subtype' type='modifierAddType' labelId='editor-subtype' deps={['type']}/>
                        { context.file.data.subtype === ModifierAddType.Ability &&
                            <ChoiceComponent field='value' type='abilityObjectId' deps={['type', 'subtype']} allowMultipleChoices/>
                        }
                        { context.file.data.subtype === ModifierAddType.Spell &&
                            <ChoiceComponent field='value' type='spellObjectId' deps={['type', 'subtype']} allowMultipleChoices/>
                        }
                        { (context.file.data.subtype === ModifierAddType.Advantage || context.file.data.subtype === ModifierAddType.Disadvantage) &&
                            <>
                                <ChoiceComponent field='binding' type='advantageBinding' deps={['type', 'subtype']}/>
                                <TextComponent field='notes' labelId='editor-notes'/>
                            </>
                        }
                        { (context.file.data.subtype === ModifierAddType.Resistance || context.file.data.subtype === ModifierAddType.Vulnerability || context.file.data.subtype === ModifierAddType.DamageImmunity) &&
                            <>
                                <ChoiceComponent field='binding' type='damageBinding' deps={['type', 'subtype']}/>
                                <TextComponent field='notes' labelId='editor-notes'/>
                            </>
                        }
                        { context.file.data.subtype === ModifierAddType.ConditionImmunity &&
                            <>
                                <ChoiceComponent field='binding' type='conditionBinding' deps={['type', 'subtype']}/>
                                <TextComponent field='notes' labelId='editor-notes'/>
                            </>
                        }
                    </>
                }
                { context.file.data.type === ModifierType.Remove &&
                    <LinkComponent field='source' labelId='editor-source' allowedTypes={AllowedTypes}/>
                }
                { context.file.data.type === ModifierType.Bonus &&
                    <>
                        <EnumComponent field='subtype' type='modifierBonusType' labelId='editor-subtype' deps={['type']}/>
                        <NumberComponent field='value' labelId='editor-value' deps={['type', 'subtype']} allowNegative/>
                    </>
                }
                { context.file.data.type === ModifierType.Set &&
                    <>
                        <EnumComponent field='subtype' type='modifierSetType' labelId='editor-subtype' deps={['type']}/>
                        { context.file.data.subtype === ModifierSetType.SpellAttribute &&
                            <ChoiceComponent field='value' type='spellAttribute' deps={['type', 'subtype']}/>
                        }{ context.file.data.subtype === ModifierSetType.Size &&
                            <ChoiceComponent field='value' type='size' deps={['type', 'subtype']}/>
                        }{ context.file.data.subtype === ModifierSetType.Sense &&
                            <>
                                <ChoiceComponent field='sense' type='sense' deps={['type', 'subtype']} allowMultipleChoices/>
                                <NumberComponent field='value' labelId='editor-value' deps={['type', 'subtype']}/>
                            </>
                        }{ context.file.data.subtype === ModifierSetType.SaveProficiency &&
                            <>
                                <ChoiceComponent field='proficiency' type='attribute' deps={['type', 'subtype']} allowMultipleChoices/>
                                <EnumComponent field='value' type='proficiencyLevel' labelId='editor-value' deps={['type', 'subtype']}/>
                            </>
                        }{ context.file.data.subtype === ModifierSetType.SkillProficiency &&
                            <>
                                <ChoiceComponent field='proficiency' type='skill' deps={['type', 'subtype']} allowMultipleChoices/>
                                <EnumComponent field='value' type='proficiencyLevel' labelId='editor-value' deps={['type', 'subtype']}/>
                            </>
                        }{ context.file.data.subtype === ModifierSetType.ToolProficiency &&
                            <>
                                <ChoiceComponent field='proficiency' type='tool' deps={['type', 'subtype']} allowMultipleChoices/>
                                <EnumComponent field='value' type='proficiencyLevel' labelId='editor-value' deps={['type', 'subtype']}/>
                            </>
                        }{ context.file.data.subtype === ModifierSetType.LanguageProficiency &&
                            <>
                                <ChoiceComponent field='proficiency' type='language' deps={['type', 'subtype']} allowMultipleChoices/>
                                <EnumComponent field='value' type='proficiencyLevelBasic' labelId='editor-value' deps={['type', 'subtype']}/>
                            </>
                        }{ context.file.data.subtype === ModifierSetType.ArmorProficiency &&
                            <>
                                <ChoiceComponent field='proficiency' type='armor' deps={['type', 'subtype']} allowMultipleChoices/>
                                <EnumComponent field='value' type='proficiencyLevelBasic' labelId='editor-value' deps={['type', 'subtype']}/>
                            </>
                        }{ context.file.data.subtype === ModifierSetType.WeaponProficiency &&
                            <>
                                <ChoiceComponent field='proficiency' type='weapon' deps={['type', 'subtype']} allowMultipleChoices/>
                                <EnumComponent field='value' type='proficiencyLevelBasic' labelId='editor-value' deps={['type', 'subtype']}/>
                            </>
                        }
                    </>
                }
                { context.file.data.type === ModifierType.Choice &&
                    <>
                        <NumberComponent field='num' labelId='editor-numChoices' deps={['type']}/>
                        <EditItemRecordComponent
                            field='options'
                            labelId='editor-options'
                            defaultValue={defaultInnerModifierValue}
                            page='innerModifier'/>
                    </>
                }
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-condition'/>} open>
                <ConditionComponent field='condition' labelId='editor-header-condition'/>
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-description'/>} open fill>
                <TextEditor
                    value={context.file.data.description}
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

export default ModifierDocumentEditor

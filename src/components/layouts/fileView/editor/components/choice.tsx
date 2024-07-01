import React, { useContext } from 'react'
import GroupItemComponent from './groupItem'
import LinkComponent from './link'
import LinkListComponent from './linkList'
import EnumComponent from './enum'
import SelectionInputComponent from './selectionInput'
import { Context, getRelativeFieldObject } from 'components/contexts/file'
import Checkbox from 'components/layouts/checkbox'
import NumberInput from 'components/layouts/numericInput'
import { isRecord } from 'utils'
import Logger from 'utils/logger'
import { isMultipleChoiceData, isSingleChoiceData } from 'structure/database/files/modifier/common'
import { DocumentType } from 'structure/database'
import { AdvantageBinding, ArmorType, Attribute, ConditionBinding, DamageBinding, Language, OptionalAttribute, Sense, SizeType, Skill, ToolType, WeaponType } from 'structure/dnd'
import type { IMultipleChoiceData, MultipleChoiceData, SingleChoiceData } from 'types/database/files/modifier'
import styles from '../style.module.scss'

export const DefaultChoiceValueMap = {
    'abilityObjectId': null,
    'spellObjectId': null,
    'advantageBinding': AdvantageBinding.Generic,
    'damageBinding': DamageBinding.Generic,
    'conditionBinding': ConditionBinding.Generic,
    'spellAttribute': OptionalAttribute.None,
    'sense': Sense.DarkVision,
    'size': SizeType.Medium,
    'attribute': Attribute.STR,
    'skill': Skill.Acrobatics,
    'tool': ToolType.AlchemistsSupplies,
    'language': Language.Common,
    'armor': ArmorType.Light,
    'weapon': WeaponType.Martial
} satisfies Record<string, unknown>

export type ChoiceValueType = keyof typeof DefaultChoiceValueMap

type ChoiceComponentParams = React.PropsWithoutRef<{
    field: string
    type: ChoiceValueType
    allowMultipleChoices?: boolean
    deps?: string[]
}>

const AbilityAllowedTypes = [DocumentType.Ability]
const SpellAllowedTypes = [DocumentType.Spell]

const ChoiceComponent: React.FC<ChoiceComponentParams> = ({ field, type, allowMultipleChoices = false, deps = [] }) => {
    const [context, dispatch] = useContext(Context)
    if (!isRecord(context.file.data)) {
        Logger.throw('Editor.BooleanComponent', 'Data of incorrect type', context.file.data)
        return null
    }

    const relative = getRelativeFieldObject(field, context.file.data)
    if (relative === null) {
        Logger.throw('Editor.BooleanComponent', 'Failed to get relative field', field)
        return null
    }

    const value = relative.relative[relative.key]
    if (!(allowMultipleChoices && isMultipleChoiceData(value)) && !(!allowMultipleChoices && isSingleChoiceData(value))) {
        Logger.throw('Editor.BooleanComponent', 'Relative field not of expected type', field, value)
        return null
    }

    const handleIsChoiceChange = (val: boolean): void => {
        if (val) {
            if (allowMultipleChoices) {
                dispatch.setData(field, { isChoice: true, numChoices: 1, value: [] } satisfies MultipleChoiceData, deps)
            } else {
                dispatch.setData(field, { isChoice: true, value: [] } satisfies SingleChoiceData, deps)
            }
        } else {
            dispatch.setData(field, { isChoice: false, value: DefaultChoiceValueMap[type] } satisfies SingleChoiceData, deps)
        }
    }

    const handleNumChoicesChange = (val: number): void => {
        if (!value.isChoice) {
            return
        }
        dispatch.setData(field, { ...value, numChoices: val } satisfies MultipleChoiceData, deps)
    }

    return (
        <>
            <GroupItemComponent labelId='editor-isChoice' className={styles.editBoolean}>
                <Checkbox value={value.isChoice} onChange={handleIsChoiceChange}/>
            </GroupItemComponent>
            { value.isChoice && allowMultipleChoices &&
                <GroupItemComponent labelId='editor-numChoices' className={styles.editGroupItem}>
                    <NumberInput value={(value as IMultipleChoiceData).numChoices} onChange={handleNumChoicesChange}/>
                </GroupItemComponent>
            }
            { type === 'abilityObjectId' && (value.isChoice
                ? <LinkListComponent field={`${field}.value`} labelId='editor-options' allowedTypes={AbilityAllowedTypes}/>
                : <LinkComponent field={`${field}.value`} labelId='editor-value' allowedTypes={AbilityAllowedTypes}/>
            )}
            { type === 'spellObjectId' && (value.isChoice
                ? <LinkListComponent field={`${field}.value`} labelId='editor-options' allowedTypes={SpellAllowedTypes}/>
                : <LinkComponent field={`${field}.value`} labelId='editor-value' allowedTypes={SpellAllowedTypes}/>
            )}
            { type === 'advantageBinding' && (value.isChoice
                ? <SelectionInputComponent field={`${field}.value`} labelId='editor-options' type='none' optionsType='advantageBinding' deps={[...deps, field]}/>
                : <EnumComponent field={`${field}.value`} labelId='editor-value' type='advantageBinding' deps={[...deps, field]}/>
            )}
            { type === 'damageBinding' && (value.isChoice
                ? <SelectionInputComponent field={`${field}.value`} labelId='editor-options' type='none' optionsType='damageBinding' deps={[...deps, field]}/>
                : <EnumComponent field={`${field}.value`} labelId='editor-value' type='damageBinding' deps={[...deps, field]}/>
            )}
            { type === 'conditionBinding' && (value.isChoice
                ? <SelectionInputComponent field={`${field}.value`} labelId='editor-options' type='none' optionsType='conditionBinding' deps={[...deps, field]}/>
                : <EnumComponent field={`${field}.value`} labelId='editor-value' type='conditionBinding' deps={[...deps, field]}/>
            )}
            { type === 'spellAttribute' && (value.isChoice
                ? <SelectionInputComponent field={`${field}.value`} labelId='editor-options' type='none' optionsType='optionalAttr' deps={[...deps, field]}/>
                : <EnumComponent field={`${field}.value`} labelId='editor-value' type='optionalAttr' deps={[...deps, field]}/>
            )}
            { type === 'sense' && (value.isChoice
                ? <SelectionInputComponent field={`${field}.value`} labelId='editor-options' type='none' optionsType='sense' deps={[...deps, field]}/>
                : <EnumComponent field={`${field}.value`} labelId='editor-value' type='sense' deps={[...deps, field]}/>
            )}
            { type === 'size' && (value.isChoice
                ? <SelectionInputComponent field={`${field}.value`} labelId='editor-options' type='none' optionsType='size' deps={[...deps, field]}/>
                : <EnumComponent field={`${field}.value`} labelId='editor-value' type='size' deps={[...deps, field]}/>
            )}
            { type === 'attribute' && (value.isChoice
                ? <SelectionInputComponent field={`${field}.value`} labelId='editor-options' type='none' optionsType='attr' deps={[...deps, field]}/>
                : <EnumComponent field={`${field}.value`} labelId='editor-value' type='attr' deps={[...deps, field]}/>
            )}
            { type === 'skill' && (value.isChoice
                ? <SelectionInputComponent field={`${field}.value`} labelId='editor-options' type='none' optionsType='skill' deps={[...deps, field]}/>
                : <EnumComponent field={`${field}.value`} labelId='editor-value' type='skill' deps={[...deps, field]}/>
            )}
            { type === 'tool' && (value.isChoice
                ? <SelectionInputComponent field={`${field}.value`} labelId='editor-options' type='none' optionsType='tool' deps={[...deps, field]}/>
                : <EnumComponent field={`${field}.value`} labelId='editor-value' type='tool' deps={[...deps, field]}/>
            )}
            { type === 'language' && (value.isChoice
                ? <SelectionInputComponent field={`${field}.value`} labelId='editor-options' type='none' optionsType='language' deps={[...deps, field]}/>
                : <EnumComponent field={`${field}.value`} labelId='editor-value' type='language' deps={[...deps, field]}/>
            )}
            { type === 'weapon' && (value.isChoice
                ? <SelectionInputComponent field={`${field}.value`} labelId='editor-options' type='none' optionsType='weaponType' deps={[...deps, field]}/>
                : <EnumComponent field={`${field}.value`} labelId='editor-value' type='weaponType' deps={[...deps, field]}/>
            )}
            { type === 'armor' && (value.isChoice
                ? <SelectionInputComponent field={`${field}.value`} labelId='editor-options' type='none' optionsType='armor' deps={[...deps, field]}/>
                : <EnumComponent field={`${field}.value`} labelId='editor-value' type='armor' deps={[...deps, field]}/>
            )}
        </>
    )
}

export default ChoiceComponent

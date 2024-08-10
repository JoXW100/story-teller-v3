import React, { useContext } from 'react'
import GroupItemComponent from './groupItem'
import LinkComponent from './link'
import LinkListComponent from './linkList'
import EnumComponent from './enum'
import SelectionInputComponent from './selectionInput'
import ListComponent from './list'
import TextComponent from './text'
import NumberComponent from './number'
import { Context } from 'components/contexts/file'
import Checkbox from 'components/controls/checkbox'
import NumberInput from 'components/controls/numericInput'
import { getRelativeFieldObject, isRecord } from 'utils'
import Logger from 'utils/logger'
import { AdvantageBinding, ArmorType, Attribute, ConditionBinding, DamageBinding, Language, MovementType, OptionalAttribute, Sense, SizeType, Skill, ToolType, WeaponTypeValue } from 'structure/dnd'
import { DocumentType } from 'structure/database'
import { isMultipleChoiceData, isSingleChoiceData } from 'structure/database/choice'
import type { MultipleChoiceData, SingleChoiceData, IMultipleChoiceData } from 'types/database/choice'
import styles from '../style.module.scss'

export const DefaultChoiceValueMap = {
    'number': 0,
    'string': '',
    'modifierObjectId': null,
    'abilityObjectId': null,
    'spellObjectId': null,
    'advantageBinding': AdvantageBinding.Generic,
    'damageBinding': DamageBinding.Generic,
    'conditionBinding': ConditionBinding.Generic,
    'spellAttribute': OptionalAttribute.None,
    'sense': Sense.DarkVision,
    'size': SizeType.Medium,
    'movement': MovementType.Walk,
    'attribute': Attribute.STR,
    'skill': Skill.Acrobatics,
    'tool': ToolType.AlchemistsSupplies,
    'language': Language.Common,
    'armor': ArmorType.Clothing,
    'weaponTypeValue': WeaponTypeValue.Martial
} satisfies Record<string, unknown>

export type ChoiceValueType = keyof typeof DefaultChoiceValueMap

type ChoiceComponentParams = React.PropsWithoutRef<{
    field: string
    type: ChoiceValueType
    allowMultipleChoices?: boolean
    fill?: boolean
}>

const ModifierAllowedTypes = [DocumentType.Modifier]
const AbilityAllowedTypes = [DocumentType.Ability]
const SpellAllowedTypes = [DocumentType.Spell]

const ChoiceComponent: React.FC<ChoiceComponentParams> = ({ field, type, allowMultipleChoices = false, fill = false }) => {
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
                dispatch.setData(field, { isChoice: true, numChoices: 1, value: [] } satisfies MultipleChoiceData)
            } else {
                dispatch.setData(field, { isChoice: true, value: [] } satisfies SingleChoiceData)
            }
        } else {
            dispatch.setData(field, { isChoice: false, value: DefaultChoiceValueMap[type] } satisfies SingleChoiceData)
        }
    }

    const handleNumChoicesChange = (val: number): void => {
        if (!value.isChoice) {
            return
        }
        dispatch.setData(field, { ...value, numChoices: val } satisfies MultipleChoiceData)
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
            { type === 'number' && (value.isChoice
                ? <ListComponent field={`${field}.value`} labelId='editor-options' type='number' fill={fill}/>
                : <NumberComponent field={`${field}.value`} labelId='editor-value' allowNegative/>
            )}
            { type === 'string' && (value.isChoice
                ? <ListComponent field={`${field}.value`} labelId='editor-options' type='string' fill={fill}/>
                : <TextComponent field={`${field}.value`} labelId='editor-value'/>
            )}
            { type === 'modifierObjectId' && (value.isChoice
                ? <LinkListComponent field={`${field}.value`} labelId='editor-options' allowedTypes={ModifierAllowedTypes} fill={fill}/>
                : <LinkComponent field={`${field}.value`} labelId='editor-value' allowedTypes={ModifierAllowedTypes}/>
            )}
            { type === 'abilityObjectId' && (value.isChoice
                ? <LinkListComponent field={`${field}.value`} labelId='editor-options' allowedTypes={AbilityAllowedTypes} fill={fill}/>
                : <LinkComponent field={`${field}.value`} labelId='editor-value' allowedTypes={AbilityAllowedTypes}/>
            )}
            { type === 'spellObjectId' && (value.isChoice
                ? <LinkListComponent field={`${field}.value`} labelId='editor-options' allowedTypes={SpellAllowedTypes} fill={fill}/>
                : <LinkComponent field={`${field}.value`} labelId='editor-value' allowedTypes={SpellAllowedTypes}/>
            )}
            { type === 'advantageBinding' && (value.isChoice
                ? <SelectionInputComponent field={`${field}.value`} labelId='editor-options' type='none' optionsType='advantageBinding' fill={fill}/>
                : <EnumComponent field={`${field}.value`} labelId='editor-value' type='advantageBinding' />
            )}
            { type === 'damageBinding' && (value.isChoice
                ? <SelectionInputComponent field={`${field}.value`} labelId='editor-options' type='none' optionsType='damageBinding' fill={fill}/>
                : <EnumComponent field={`${field}.value`} labelId='editor-value' type='damageBinding' />
            )}
            { type === 'conditionBinding' && (value.isChoice
                ? <SelectionInputComponent field={`${field}.value`} labelId='editor-options' type='none' optionsType='conditionBinding' fill={fill}/>
                : <EnumComponent field={`${field}.value`} labelId='editor-value' type='conditionBinding' />
            )}
            { type === 'spellAttribute' && (value.isChoice
                ? <SelectionInputComponent field={`${field}.value`} labelId='editor-options' type='none' optionsType='optionalAttr' fill={fill}/>
                : <EnumComponent field={`${field}.value`} labelId='editor-value' type='optionalAttr' />
            )}
            { type === 'sense' && (value.isChoice
                ? <SelectionInputComponent field={`${field}.value`} labelId='editor-options' type='none' optionsType='sense' fill={fill}/>
                : <EnumComponent field={`${field}.value`} labelId='editor-value' type='sense' />
            )}
            { type === 'size' && (value.isChoice
                ? <SelectionInputComponent field={`${field}.value`} labelId='editor-options' type='none' optionsType='size' fill={fill}/>
                : <EnumComponent field={`${field}.value`} labelId='editor-value' type='size' />
            )}
            { type === 'attribute' && (value.isChoice
                ? <SelectionInputComponent field={`${field}.value`} labelId='editor-options' type='none' optionsType='attr' fill={fill}/>
                : <EnumComponent field={`${field}.value`} labelId='editor-value' type='attr' />
            )}
            { type === 'skill' && (value.isChoice
                ? <SelectionInputComponent field={`${field}.value`} labelId='editor-options' type='none' optionsType='skill' fill={fill}/>
                : <EnumComponent field={`${field}.value`} labelId='editor-value' type='skill' />
            )}
            { type === 'movement' && (value.isChoice
                ? <SelectionInputComponent field={`${field}.value`} labelId='editor-options' type='none' optionsType='movement' fill={fill}/>
                : <EnumComponent field={`${field}.value`} labelId='editor-speed' type='movement' />
            )}
            { type === 'tool' && (value.isChoice
                ? <SelectionInputComponent field={`${field}.value`} labelId='editor-options' type='none' optionsType='tool' fill={fill}/>
                : <EnumComponent field={`${field}.value`} labelId='editor-value' type='tool' />
            )}
            { type === 'language' && (value.isChoice
                ? <SelectionInputComponent field={`${field}.value`} labelId='editor-options' type='none' optionsType='language' fill={fill}/>
                : <EnumComponent field={`${field}.value`} labelId='editor-value' type='language' />
            )}
            { type === 'weaponTypeValue' && (value.isChoice
                ? <SelectionInputComponent field={`${field}.value`} labelId='editor-options' type='none' optionsType='weaponTypeValue' fill={fill}/>
                : <EnumComponent field={`${field}.value`} labelId='editor-value' type='weaponTypeValue' />
            )}
            { type === 'armor' && (value.isChoice
                ? <SelectionInputComponent field={`${field}.value`} labelId='editor-options' type='none' optionsType='armor' fill={fill}/>
                : <EnumComponent field={`${field}.value`} labelId='editor-value' type='armor' />
            )}
        </>
    )
}

export default ChoiceComponent

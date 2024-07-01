import React, { useContext } from 'react'
import Tooltip from '@mui/material/Tooltip'
import EditIcon from '@mui/icons-material/EditSharp'
import GroupItemComponent from './groupItem'
import type { LanguageKey } from 'data'
import { Context, getRelativeFieldObject } from 'components/contexts/file'
import LocalizedText from 'components/localizedText'
import DropdownMenu from 'components/layouts/dropdownMenu'
import Checkbox from 'components/layouts/checkbox'
import NumberInput from 'components/layouts/numericInput'
import ListTemplateMenu, { type ListTemplateComponentProps } from 'components/layouts/menus/template'
import { isRecord } from 'utils'
import Logger from 'utils/logger'
import Condition, { ConditionType, ConditionValueType } from 'structure/database/condition'
import { getOptionType } from 'structure/optionData'
import ConditionFactory from 'structure/database/condition/factory'
import type { ConditionExplicit, ConditionValue, ICondition, IConditionProperties } from 'types/database/condition'
import styles from '../style.module.scss'

type ConditionComponentParams = React.PropsWithoutRef<{
    field: string
    labelId: LanguageKey
    labelArgs?: any[]
    deps?: string[]
}>

interface IItemListParams {
    field: string
    deps: string[]
}

interface IItemListValueParams {
    field: string
    deps: string[]
}

const PropertyMap = {
    level: <LocalizedText id='editor-properties-level'/>,
    casterLevel: <LocalizedText id='editor-properties-casterLevel'/>,
    str: <LocalizedText id='editor-properties-str'/>,
    dex: <LocalizedText id='editor-properties-dex'/>,
    con: <LocalizedText id='editor-properties-con'/>,
    int: <LocalizedText id='editor-properties-int'/>,
    wis: <LocalizedText id='editor-properties-wis'/>,
    cha: <LocalizedText id='editor-properties-cha'/>,
    spellAttribute: <LocalizedText id='editor-properties-spellAttribute'/>,
    proficiency: <LocalizedText id='editor-properties-proficiency'/>,
    critRange: <LocalizedText id='editor-properties-critRange'/>,
    multiAttack: <LocalizedText id='editor-properties-multiAttack'/>,
    spellLevel: <LocalizedText id='editor-properties-spellLevel'/>
} satisfies Record<keyof IConditionProperties, React.ReactNode>

type ConditionEditorValue = {
    type: ConditionValueType.Boolean
    value: boolean
} | {
    type: ConditionValueType.Constant
    value: number
} | {
    type: ConditionValueType.Property
    value: keyof typeof PropertyMap
}

function createCondition(type: ConditionType): ICondition {
    switch (type) {
        case ConditionType.Not:
            return { not: { eq: [] } satisfies ICondition } satisfies ICondition
        default:
            return { [type]: [] } satisfies ICondition
    }
}

function createValue(value: ConditionEditorValue): ConditionValue {
    switch (value.type) {
        case ConditionValueType.Constant:
            return value.value
        case ConditionValueType.Boolean:
            return value.value
        case ConditionValueType.Property:
            return { property: value.value } satisfies ConditionExplicit
    }
}

const ConditionComponent: React.FC<ConditionComponentParams> = ({ field, labelId, labelArgs, deps = [] }) => {
    const [context, dispatch] = useContext(Context)
    if (!isRecord(context.file.data)) {
        Logger.throw('Editor.ConditionComponent', 'Data of incorrect type', context.file.data)
        return null
    }

    const relative = getRelativeFieldObject(field, context.file.data)
    if (relative === null) {
        Logger.throw('Editor.ConditionComponent', 'Failed to get relative field', field)
        return null
    }

    const option = getOptionType('condition')
    const value = relative.relative[relative.key]
    if (!(value instanceof Condition)) {
        Logger.throw('Editor.ConditionComponent', 'Relative field not of expected type', value)
        return null
    }

    const handleInput = (type: ConditionType): void => {
        let val = null
        switch (type) {
            case ConditionType.Equals:
            case ConditionType.NotEquals:
            case ConditionType.GreaterEquals:
            case ConditionType.LessEquals:
            case ConditionType.Or:
            case ConditionType.Nor:
            case ConditionType.And:
            case ConditionType.Nand:
                val = []
                break
            case ConditionType.Not:
                val = { eq: [] } satisfies ICondition
                break
        }
        dispatch.setData(field, { [type]: val }, deps)
    }

    const handleChange = (val: ICondition[] | ConditionValue[]): void => {
        dispatch.setData(field, ConditionFactory.create({ [value.data.type]: val }), deps)
    }

    const handleClick = (): void => {
        dispatch.pushEditorPage({
            pageKey: 'condition',
            root: `${field}.${value.data.type}`,
            name: option.options[value.data.type],
            deps: deps
        })
    }

    return (
        <GroupItemComponent labelId={labelId} labelArgs={labelArgs} className={styles.editCondition}>
            <div>
                { context.editorPages[context.editorPages.length - 1].pageKey !== 'condition' &&
                    <DropdownMenu
                        className={styles.dropdown}
                        itemClassName={styles.dropdownItem}
                        values={option.options}
                        value={value.data.type}
                        onChange={handleInput}/>
                }
                { value.data.type === ConditionType.Not &&
                    <Tooltip title={<LocalizedText id='common-edit'/>}>
                        <button className='center-flex fill-height square' onClick={handleClick}>
                            <EditIcon className='small-icon'/>
                        </button>
                    </Tooltip>
                }
                { (value.data.type === ConditionType.Or || value.data.type === ConditionType.Nor || value.data.type === ConditionType.And || value.data.type === ConditionType.Nand) &&
                    <ListTemplateMenu<ICondition, ConditionType, IItemListParams>
                        values={value.data.value}
                        defaultValue={ConditionType.Equals}
                        params={{ field: `${field}.${value.data.type}`, deps: deps }}
                        createValue={createCondition}
                        Component={ItemListItemComponent}
                        EditComponent={ItemListEditComponent}
                        onChange={handleChange}
                        addLast/>
                }
                { (value.data.type === ConditionType.Equals || value.data.type === ConditionType.NotEquals || value.data.type === ConditionType.GreaterEquals || value.data.type === ConditionType.LessEquals) &&
                    <ListTemplateMenu<ConditionValue, ConditionEditorValue, IItemListParams>
                        values={value.data.value}
                        defaultValue={{ type: ConditionValueType.Constant, value: 0 }}
                        params={{ field: `${field}.${value.data.type}`, deps: deps }}
                        createValue={createValue}
                        Component={ItemListValueItemComponent}
                        EditComponent={ItemListValueEditComponent}
                        onChange={handleChange}
                        validateInput={(_, values) => (value.data.type !== ConditionType.GreaterEquals && value.data.type !== ConditionType.LessEquals) || values.length < 2}
                        addLast/>
                }
            </div>
        </GroupItemComponent>
    )
}

type ListItemComponentParams = ListTemplateComponentProps<ICondition, ICondition, IItemListParams>
type ListEditComponentParams = ListTemplateComponentProps<ICondition, ConditionType, IItemListParams>
type ItemListValueItemComponentParams = ListTemplateComponentProps<ConditionValue, ConditionValue, IItemListValueParams>
type ItemListValueEditComponentParams = ListTemplateComponentProps<ConditionValue, ConditionEditorValue, IItemListValueParams>

const ItemListItemComponent: React.FC<ListItemComponentParams> = ({ value, values, index, params, onUpdate }) => {
    const [, dispatch] = useContext(Context)
    const condition = value instanceof Condition ? value : ConditionFactory.create(value)

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = () => {
        dispatch.pushEditorPage({
            pageKey: 'condition',
            root: `${params.field}.${index}`,
            name: getOptionType('condition').options[condition.data.type],
            deps: params.deps
        })
    }

    return (
        <div className={styles.editRecordItem}>
            <span className='fill'>{`${index + 1}: ${getOptionType('condition').options[condition.data.type]}`}</span>
            <Tooltip title={<LocalizedText id='common-edit'/>}>
                <button className='center-flex fill-height square' onClick={handleClick}>
                    <EditIcon className='small-icon'/>
                </button>
            </Tooltip>
        </div>
    )
}

const ItemListEditComponent: React.FC<ListEditComponentParams> = ({ value, onUpdate }) => {
    return (
        <div>
            <DropdownMenu
                className={styles.dropdown}
                itemClassName={styles.dropdownItem}
                value={value}
                values={getOptionType('condition').options}
                onChange={onUpdate}/>
        </div>
    )
}

const ItemListValueItemComponent: React.FC<ItemListValueItemComponentParams> = ({ value, values, index, params, onUpdate }) => {
    switch (typeof value) {
        case 'number':
        case 'string':
            return <div className='fill center-vertical-flex'>{value}</div>
        case 'object':
            if (value !== null && 'property' in value) {
                return <div className='fill center-vertical-flex'>{PropertyMap[value.property]}</div>
            }
            if (value !== null && 'value' in value) {
                return <div className='fill center-vertical-flex'>{value.value}</div>
            }
            return <div/>
        default:
            return <div/>
    }
}

const ItemListValueEditComponent: React.FC<ItemListValueEditComponentParams> = ({ value, values, index, params, onUpdate }) => {
    const handleTypeChange = (type: ConditionValueType): void => {
        switch (type) {
            case ConditionValueType.Boolean:
                onUpdate({ type: type, value: false })
                break
            case ConditionValueType.Constant:
                onUpdate({ type: type, value: 0 })
                break
            case ConditionValueType.Property:
                onUpdate({ type: type, value: 'level' })
                break
        }
    }

    return (
        <div className={styles.editConditionValueEditItem}>
            <DropdownMenu
                className={styles.dropdown}
                itemClassName={styles.dropdownItem}
                value={value.type}
                values={getOptionType('conditionValue').options}
                onChange={handleTypeChange}/>
            { value.type === ConditionValueType.Boolean &&
                <Checkbox value={value.value} onChange={(val) => { onUpdate({ type: value.type, value: val }) }}/>
            }
            { value.type === ConditionValueType.Constant &&
                <NumberInput value={value.value} onChange={(val) => { onUpdate({ type: value.type, value: val }) }}/>
            }
            { value.type === ConditionValueType.Property &&
                <DropdownMenu value={value.value} values={PropertyMap} onChange={(val) => { onUpdate({ type: value.type, value: val }) }}/>
            }
        </div>
    )
}

export default ConditionComponent

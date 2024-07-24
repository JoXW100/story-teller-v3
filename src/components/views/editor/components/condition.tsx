import React, { useContext } from 'react'
import Tooltip from '@mui/material/Tooltip'
import EditIcon from '@mui/icons-material/EditSharp'
import GroupItemComponent from './groupItem'
import type { LanguageKey } from 'assets'
import { Context } from 'components/contexts/file'
import LocalizedText from 'components/controls/localizedText'
import DropdownMenu from 'components/controls/dropdownMenu'
import NumberInput from 'components/controls/numericInput'
import ListTemplateMenu, { type ListTemplateComponentProps } from 'components/controls/menus/template'
import { isRecord, createField, getRelativeFieldObject, asBooleanString } from 'utils'
import Logger from 'utils/logger'
import { useLocalizedOptions } from 'utils/hooks/localization'
import Condition, { ConditionType, ConditionValueType } from 'structure/database/condition'
import ConditionFactory from 'structure/database/condition/factory'
import type { ConditionExplicit, ConditionValue, IConditionProperties } from 'types/database/condition'
import styles from '../style.module.scss'

type ConditionComponentParams = React.PropsWithoutRef<{
    field: string
    labelId: LanguageKey
    labelArgs?: any[]
    deps?: string[]
}>

const PropertyMap: Record<keyof IConditionProperties, React.ReactNode> = {
    level: <LocalizedText id='editor-properties-level' />,
    casterLevel: <LocalizedText id='editor-properties-casterLevel' />,
    classLevel: <LocalizedText id='editor-properties-classLevel' />,
    spellLevel: <LocalizedText id='editor-properties-spellLevel' />,
    armorLevel: <LocalizedText id='editor-properties-armorLevel' />,
    shieldLevel: <LocalizedText id='editor-properties-shieldLevel' />,
    str: <LocalizedText id='editor-properties-str' />,
    dex: <LocalizedText id='editor-properties-dex' />,
    con: <LocalizedText id='editor-properties-con' />,
    int: <LocalizedText id='editor-properties-int' />,
    wis: <LocalizedText id='editor-properties-wis' />,
    cha: <LocalizedText id='editor-properties-cha' />,
    spellAttribute: <LocalizedText id='editor-properties-spellAttribute' />,
    proficiency: <LocalizedText id='editor-properties-proficiency' />,
    critRange: <LocalizedText id='editor-properties-critRange' />,
    critDieCount: <LocalizedText id='editor-properties-critDieCount' />,
    multiAttack: <LocalizedText id='editor-properties-multiAttack' />,
    attunedItems: <LocalizedText id='editor-properties-attunedItems' />,
    walkSpeed: <LocalizedText id='editor-properties-walkSpeed' />,
    burrowSpeed: <LocalizedText id='editor-properties-burrowSpeed' />,
    climbSpeed: <LocalizedText id='editor-properties-climbSpeed' />,
    flySpeed: <LocalizedText id='editor-properties-flySpeed' />,
    hoverSpeed: <LocalizedText id='editor-properties-hoverSpeed' />,
    swimSpeed: <LocalizedText id='editor-properties-swimSpeed' />
}

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

function createCondition(type: ConditionType): Condition {
    switch (type) {
        case ConditionType.None:
            return new Condition({ type: type })
        case ConditionType.Not:
            return new Condition({ type: type, value: new Condition({ type: ConditionType.And, value: [] }) })
        default:
            return new Condition({ type: type, value: [] })
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

function createEditorValue(value: ConditionValue): ConditionEditorValue {
    if (typeof value === 'number') {
        return { type: ConditionValueType.Constant, value: value }
    }
    if (typeof value === 'boolean') {
        return { type: ConditionValueType.Boolean, value: value }
    }
    if (isRecord(value) && 'property' in value) {
        return { type: ConditionValueType.Property, value: value.property }
    }
    // Default value
    return { type: ConditionValueType.Constant, value: 0 }
}

const ConditionComponent: React.FC<ConditionComponentParams> = ({ field, labelId, labelArgs, deps = [] }) => {
    const [context] = useContext(Context)
    if (!isRecord(context.file.data)) {
        Logger.throw('Editor.ConditionComponent', 'Data of incorrect type', context.file.data)
        return null
    }

    const relative = getRelativeFieldObject(field, context.file.data)
    if (relative === null) {
        Logger.throw('Editor.ConditionComponent', 'Failed to get relative field', field)
        return null
    }

    const value = relative.relative[relative.key]
    if (!(value instanceof Condition)) {
        Logger.throw('Editor.ConditionComponent', 'Relative field not of expected type', value)
        return null
    }

    return (
        <GroupItemComponent labelId={labelId} labelArgs={labelArgs} className={styles.editCondition}>
            <ConditionControl
                value={value}
                field={field}
                allowEditType={context.editorPages[context.editorPages.length - 1].pageKey !== 'condition'}/>
        </GroupItemComponent>
    )
}

interface IItemParams {
    field: string
    deps?: string[]
}

type ConditionControlProps = React.PropsWithoutRef<{
    value: Condition
    field: string
    className?: string
    allowEditType?: boolean
}>

export const ConditionControl: React.FC<ConditionControlProps> = ({ value, field, className, allowEditType = false }) => {
    const [, dispatch] = useContext(Context)
    const options = useLocalizedOptions('condition')

    const handleInput = (type: ConditionType): void => {
        switch (type) {
            case ConditionType.Equals:
            case ConditionType.NotEquals:
            case ConditionType.GreaterEquals:
            case ConditionType.Range:
            case ConditionType.LessEquals:
            case ConditionType.Or:
            case ConditionType.Nor:
            case ConditionType.And:
            case ConditionType.Nand:
                dispatch.setData(field, new Condition({ type: type, value: [] }))
                break
            case ConditionType.Not:
                dispatch.setData(field, new Condition({ type: type, value: new Condition({ type: ConditionType.Equals, value: [] }) }))
                break
            case ConditionType.None:
                dispatch.setData(field, new Condition({ type: type }))
                break
        }
    }

    const handleChangeConditionValue = (val: ConditionValue[]): void => {
        if (value.data.type === ConditionType.Equals || value.data.type === ConditionType.NotEquals) {
            dispatch.setData(field, new Condition({ type: value.data.type, value: val }))
        }
    }

    const handleChangeSpecificConditionValue = (val: ConditionEditorValue, index: number, length: number): void => {
        if (value.data.type === ConditionType.GreaterEquals || value.data.type === ConditionType.LessEquals || value.data.type === ConditionType.Range) {
            let result
            if (value.data.value.length < length) {
                result = Array.from({ length: length }).map(() => 0)
            } else {
                result = [...value.data.value]
            }
            result[index] = createValue(val)
            dispatch.setData(field, new Condition({ type: value.data.type, value: result }))
        }
    }

    const handleChangeCondition = (val: Condition[]): void => {
        if (value.data.type === ConditionType.Or || value.data.type === ConditionType.Nor || value.data.type === ConditionType.And || value.data.type === ConditionType.Nand) {
            dispatch.setData(field, new Condition({ type: value.data.type, value: val }))
        }
    }

    const handleClick = (): void => {
        dispatch.pushEditorPage({
            pageKey: 'condition',
            root: createField(field, value.data.type),
            name: options[value.data.type]
        })
    }

    return (
        <div className={className}>
            { allowEditType &&
                <DropdownMenu
                    className={styles.dropdown}
                    itemClassName={styles.dropdownItem}
                    values={options}
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
                <ListTemplateMenu<Condition, ConditionType, IItemParams>
                    values={value.data.value}
                    defaultValue={ConditionType.Equals}
                    params={{ field: createField(field, value.data.type) }}
                    createValue={createCondition}
                    Component={ItemListItemComponent}
                    EditComponent={ItemListEditComponent}
                    onChange={handleChangeCondition}
                    addLast/>
            }
            { (value.data.type === ConditionType.Equals || value.data.type === ConditionType.NotEquals) &&
                <ListTemplateMenu<ConditionValue, ConditionEditorValue, IItemParams>
                    values={value.data.value}
                    defaultValue={{ type: ConditionValueType.Constant, value: 0 }}
                    params={{ field: createField(field, value.data.type) }}
                    createValue={createValue}
                    Component={ItemListValueItemComponent}
                    EditComponent={ItemListValueEditComponent}
                    onChange={handleChangeConditionValue}
                    addLast/>
            }
            { (value.data.type === ConditionType.GreaterEquals || value.data.type === ConditionType.LessEquals) &&
                <>
                    <ItemListValueEditComponent
                        index={0}
                        value={createEditorValue(value.data.value[0])}
                        values={value.data.value}
                        params={{ field: createField(field, value.data.type) }}
                        onUpdate={(value) => { handleChangeSpecificConditionValue(value, 0, 2) }}/>
                    { value.data.type === ConditionType.GreaterEquals ? '>=' : '<='}
                    <ItemListValueEditComponent
                        index={1}
                        value={createEditorValue(value.data.value[1])}
                        values={value.data.value}
                        params={{ field: createField(field, value.data.type) }}
                        onUpdate={(value) => { handleChangeSpecificConditionValue(value, 1, 2) }}/>
                </>
            }
            { value.data.type === ConditionType.Range &&
                <>
                    <ItemListValueEditComponent
                        index={0}
                        value={createEditorValue(value.data.value[0])}
                        values={value.data.value}
                        params={{ field: createField(field, value.data.type) }}
                        onUpdate={(value) => { handleChangeSpecificConditionValue(value, 0, 3) }}/>
                    {'<='}
                    <ItemListValueEditComponent
                        index={1}
                        value={createEditorValue(value.data.value[1])}
                        values={value.data.value}
                        params={{ field: createField(field, value.data.type) }}
                        onUpdate={(value) => { handleChangeSpecificConditionValue(value, 1, 3) }}/>
                    {'<='}
                    <ItemListValueEditComponent
                        index={2}
                        value={createEditorValue(value.data.value[2])}
                        values={value.data.value}
                        params={{ field: createField(field, value.data.type) }}
                        onUpdate={(value) => { handleChangeSpecificConditionValue(value, 2, 3) }}/>
                </>
            }
        </div>
    )
}

type ListItemComponentParams = ListTemplateComponentProps<Condition, Condition, IItemParams>
const ItemListItemComponent: React.FC<ListItemComponentParams> = ({ value, index, params }) => {
    const [, dispatch] = useContext(Context)
    const options = useLocalizedOptions('condition')
    const condition = value instanceof Condition ? value : ConditionFactory.create(value)

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = () => {
        dispatch.pushEditorPage({
            pageKey: 'condition',
            root: createField(params.field, String(index)),
            name: options[condition.data.type]
        })
    }

    return (
        <div className={styles.editRecordItem}>
            <span className='fill'>{`${index + 1}: ${options[condition.data.type]}`}</span>
            <Tooltip title={<LocalizedText id='common-edit'/>}>
                <button className='center-flex fill-height square' onClick={handleClick}>
                    <EditIcon className='small-icon'/>
                </button>
            </Tooltip>
        </div>
    )
}

type ListEditComponentParams = ListTemplateComponentProps<Condition, ConditionType, IItemParams>
const ItemListEditComponent: React.FC<ListEditComponentParams> = ({ value, onUpdate }) => {
    const options = useLocalizedOptions('condition')
    return (
        <div>
            <DropdownMenu
                className={styles.dropdown}
                itemClassName={styles.dropdownItem}
                value={value}
                values={options}
                onChange={onUpdate}/>
        </div>
    )
}

type ItemListValueItemComponentParams = ListTemplateComponentProps<ConditionValue, ConditionValue, IItemParams>
const ItemListValueItemComponent: React.FC<ItemListValueItemComponentParams> = ({ value }) => {
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

type ItemListValueEditComponentParams = ListTemplateComponentProps<ConditionValue, ConditionEditorValue, IItemParams>
const ItemListValueEditComponent: React.FC<ItemListValueEditComponentParams> = ({ value, onUpdate }) => {
    const options = useLocalizedOptions('conditionValue')
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
                values={options}
                onChange={handleTypeChange}/>
            { value.type === ConditionValueType.Boolean &&
                <DropdownMenu
                    className={styles.dropdown}
                    itemClassName={styles.dropdownItem}
                    value={asBooleanString(value.value)}
                    values={{
                        'true': <LocalizedText id='common-true'/>,
                        'false': <LocalizedText id='common-false'/>
                    }}
                    onChange={(val) => { onUpdate({ type: value.type, value: Boolean(val) }) }}/>
            }{ value.type === ConditionValueType.Constant &&
                <NumberInput value={value.value} onChange={(val) => { onUpdate({ type: value.type, value: val }) }}/>
            }{ value.type === ConditionValueType.Property &&
                <DropdownMenu
                    className={styles.dropdown}
                    itemClassName={styles.dropdownItem}
                    value={value.value}
                    values={PropertyMap}
                    onChange={(val) => { onUpdate({ type: value.type, value: val }) }}/>
            }
        </div>
    )
}

export default ConditionComponent

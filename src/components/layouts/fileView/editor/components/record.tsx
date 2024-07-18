import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import GroupItemComponent from './groupItem'
import { Context } from 'components/contexts/file'
import RecordMenu, { type RecordComponentProps } from 'components/layouts/menus/record'
import NumberInput from 'components/layouts/numericInput'
import DropdownMenu from 'components/layouts/dropdownMenu'
import type { LanguageKey } from 'data'
import { asBooleanString, asEnum, isRecord, getRelativeFieldObject } from 'utils'
import Logger from 'utils/logger'
import { useLocalizedText } from 'utils/hooks/localizedText'
import { type OptionTypeKey, getOptionType } from 'structure/optionData'
import styles from '../style.module.scss'

type RecordComponentParams = React.PropsWithoutRef<{
    field: string
    defaultValue: unknown
    inputType: 'text' | 'enum'
    valueType: 'text' | 'number'
    enumType?: OptionTypeKey
    labelId: LanguageKey
    labelArgs?: any[]
    placeholderId?: LanguageKey
    placeholderArgs?: any[]
    allowKeyChange?: boolean
    allowNegative?: boolean
}>

interface IRecordItemComponent {
    inputType: 'text' | 'enum'
    valueType: RecordComponentParams['valueType']
    enumType?: OptionTypeKey
    handleChange: (value: unknown) => void
    placeholder?: string
    allowKeyChange: boolean
}

type RecordItemComponentParams = RecordComponentProps<unknown, IRecordItemComponent>

const RecordComponent: React.FC<RecordComponentParams> = ({ field, defaultValue, inputType, valueType, enumType, labelId, labelArgs, placeholderId, placeholderArgs, allowKeyChange }) => {
    const [context, dispatch] = useContext(Context)
    const placeholder = useLocalizedText(placeholderId, placeholderArgs)

    const handleChange = useCallback((value: unknown): void => {
        dispatch.setData(field, value)
    }, [dispatch, field])

    const params = useMemo<IRecordItemComponent>(() => ({
        inputType: inputType,
        valueType: valueType,
        enumType: enumType,
        handleChange: handleChange,
        placeholder: placeholder,
        allowKeyChange: allowKeyChange ?? false
    }), [inputType, valueType, enumType, handleChange, placeholder, allowKeyChange])

    if (!isRecord(context.file.data)) {
        Logger.throw('Editor.RecordComponent', 'Data of incorrect type', context.file.data)
        return null
    }

    const relative = getRelativeFieldObject(field, context.file.data)
    if (relative === null) {
        Logger.throw('Editor.RecordComponent', 'Failed to get relative field', field)
        return null
    }

    const values = relative.relative[relative.key]
    if (!isRecord(values)) {
        Logger.throw('Editor.RecordComponent', 'Relative field not of expected type', field, values)
        return null
    }

    return (
        <GroupItemComponent className={styles.editList} labelId={labelId} labelArgs={labelArgs}>
            <RecordMenu<unknown, IRecordItemComponent>
                itemClassName={styles.itemListItem}
                values={values}
                defaultValue={defaultValue}
                onChange={handleChange}
                params={params}
                Component={RecordItemComponent}
                EditComponent={RecordEditComponent}/>
        </GroupItemComponent>
    )
}

const RecordItemComponent: React.FC<RecordItemComponentParams> = ({ itemKey, value, values, update, params }) => {
    const [label, setLabel] = useState(itemKey)
    const optionType = params.enumType !== undefined
        ? getOptionType(params.enumType)
        : null

    const validateKey = (key: string): boolean => {
        return key.length > 0 && !(key in values)
    }

    const handleInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setLabel(e.target.value)
        if (validateKey(e.target.value)) {
            update(e.target.value)
        }
    }

    const handleChange = (value: unknown): void => {
        params.handleChange({ ...values, [itemKey]: value })
    }

    const handleValueInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        handleChange(e.target.value)
    }

    useEffect(() => {
        setLabel((label) => label !== itemKey ? itemKey : label)
    }, [itemKey])

    return (
        <div className={styles.editRecordItem}>
            { params.allowKeyChange && params.inputType === 'text' &&
                <input
                    className={styles.editInput}
                    value={label}
                    type="text"
                    onChange={handleInput}
                    data={asBooleanString(label === itemKey)}/>
            }
            { !params.allowKeyChange && params.inputType === 'text' && label }
            { params.allowKeyChange && params.inputType === 'enum' && optionType !== null &&
                <DropdownMenu
                    className={styles.editInput}
                    value={asEnum(value, optionType.enum) ?? optionType.default}
                    values={optionType.options as Record<string, React.ReactNode>}
                    onChange={update}/>
            }
            { !params.allowKeyChange && params.inputType === 'enum' && optionType !== null &&
                (optionType.options as Record<string, React.ReactNode>)[asEnum(value, optionType.enum) ?? optionType.default]
            }
            { params.valueType === 'text' &&
                <input
                    className={styles.editInput}
                    value={String(value)}
                    type="text"
                    placeholder={params.placeholder}
                    onChange={handleValueInput}/>
            }
            { params.valueType === 'number' &&
                <NumberInput
                    className={styles.editInput}
                    value={Number(value)}
                    placeholder={params.placeholder}
                    onChange={handleChange}
                    allowDecimal
                    allowNegative/>
            }
        </div>
    )
}

const RecordEditComponent: React.FC<RecordItemComponentParams> = ({ value, update, params }) => {
    if (params.inputType === 'text') {
        const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
            update(e.target.value)
        }
        return (
            <input
                className={styles.editInput}
                value={String(value)}
                type='text'
                placeholder={params.placeholder}
                onChange={handleChange}/>
        )
    }
    if (params.inputType === 'enum' && params.enumType !== undefined) {
        const optionType = getOptionType(params.enumType)
        return (
            <DropdownMenu
                className={styles.editInput}
                value={asEnum(value, optionType.enum) ?? optionType.default}
                values={optionType.options as Record<string, React.ReactNode>}
                onChange={update}/>
        )
    }
    return null
}

export default RecordComponent

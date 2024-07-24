import { useContext, useEffect, useMemo, useState } from 'react'
import type { EditorPageKeyType } from '..'
import GroupItemComponent from './groupItem'
import EditItemButtonComponent from './editItemButton'
import { Context } from 'components/contexts/file'
import RecordMenu, { type RecordComponentProps } from 'components/controls/menus/record'
import { asBooleanString, isRecord, createField, getRelativeFieldObject } from 'utils'
import Logger from 'utils/logger'
import type { LanguageKey } from 'assets'
import styles from '../style.module.scss'

type EditItemRecordComponentParams = React.PropsWithoutRef<{
    field: string
    defaultValue: unknown
    labelId: LanguageKey
    labelArgs?: any[]
    page: EditorPageKeyType
    fill?: boolean
}>

interface IEditItemRecordParams {
    page: EditorPageKeyType
    field: string
}

const EditItemRecordComponent: React.FC<EditItemRecordComponentParams> = ({ field, defaultValue, labelId, labelArgs, page, fill = false }) => {
    const [context, dispatch] = useContext(Context)

    const handleChange = (value: unknown): void => {
        dispatch.setData(field, value)
    }

    const params = useMemo<IEditItemRecordParams>(() => ({
        page: page,
        field: field
    }), [page, field])

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

    const handleValidate = (value: string): boolean => {
        return !value.includes('.')
    }

    return (
        <GroupItemComponent
            className={styles.editList}
            data={asBooleanString(fill)}
            labelId={labelId}
            labelArgs={labelArgs}>
            <RecordMenu
                itemClassName={styles.itemListItem}
                values={values}
                defaultValue={defaultValue}
                onChange={handleChange}
                validateInput={handleValidate}
                params={params}
                Component={EditItemRecordItemComponent}
                EditComponent={EditItemRecordEditComponent}/>
        </GroupItemComponent>
    )
}

type RecordItemComponentParams = RecordComponentProps<unknown, IEditItemRecordParams>

const EditItemRecordItemComponent: React.FC<RecordItemComponentParams> = ({ itemKey, values, update, params }) => {
    const [label, setLabel] = useState(itemKey)

    const validateKey = (key: string): boolean => {
        return key.length > 0 && !(key in values) && !key.includes('.')
    }

    const handleInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setLabel(e.target.value)
        if (validateKey(e.target.value)) {
            update(e.target.value)
        }
    }

    useEffect(() => {
        setLabel((label) => label !== itemKey ? itemKey : label)
    }, [itemKey])

    return (
        <div className={styles.editRecordItem}>
            <input
                className={styles.editInput}
                value={label}
                type="text"
                onChange={handleInput}
                data={asBooleanString(label === itemKey)}
                error={asBooleanString(label.includes('.'))}/>
            <EditItemButtonComponent
                pageKey={params.page}
                root={createField(params.field, itemKey)}
                name={itemKey}/>
        </div>
    )
}

const EditItemRecordEditComponent: React.FC<RecordItemComponentParams> = ({ itemKey, update }) => {
    const handleInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        update(e.target.value)
    }

    return (
        <input
            className={styles.editInput}
            value={itemKey}
            type="text"
            onChange={handleInput}
            error={asBooleanString(itemKey.includes('.'))}/>
    )
}

export default EditItemRecordComponent

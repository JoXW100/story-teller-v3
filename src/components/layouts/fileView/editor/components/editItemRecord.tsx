import { useContext, useEffect, useMemo, useState } from 'react'
import GroupItemComponent from './groupItem'
import type { EditorPageKeyType } from '..'
import { Context, getRelativeFieldObject } from 'components/contexts/file'
import RecordMenu, { type RecordComponentProps } from 'components/layouts/menus/record'
import { asBooleanString, isRecord } from 'utils'
import Logger from 'utils/logger'
import type { LanguageKey } from 'data'
import styles from '../style.module.scss'
import EditItemButtonComponent from './editItemButton'

type EditItemRecordComponentParams = React.PropsWithoutRef<{
    field: string
    defaultValue: unknown
    labelId: LanguageKey
    labelArgs?: any[]
    page: EditorPageKeyType
    deps?: string[]
    fill?: boolean
}>

interface IEditItemRecordParams {
    page: EditorPageKeyType
    field: string
    deps: string[]
}

const EditItemRecordComponent: React.FC<EditItemRecordComponentParams> = ({ field, defaultValue, labelId, labelArgs, page, deps = [], fill = false }) => {
    const [context, dispatch] = useContext(Context)

    const handleChange = (value: unknown): void => {
        dispatch.setData(field, value, deps)
    }

    const params = useMemo<IEditItemRecordParams>(() => ({
        page: page,
        field: field,
        deps: deps
    }), [page, field, deps])

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
        <GroupItemComponent
            className={styles.editList}
            data={String(fill)}
            labelId={labelId}
            labelArgs={labelArgs}>
            <RecordMenu
                itemClassName={styles.itemListItem}
                values={values}
                defaultValue={defaultValue}
                onChange={handleChange}
                params={params}
                Component={EditItemRecordItemComponent}
                EditComponent={EditItemRecordEditComponent}/>
        </GroupItemComponent>
    )
}

type RecordItemComponentParams = RecordComponentProps<unknown, IEditItemRecordParams>

const EditItemRecordItemComponent: React.FC<RecordItemComponentParams> = ({ itemKey, value, values, update, params }) => {
    const [label, setLabel] = useState(itemKey)

    const validateKey = (key: string): boolean => {
        return key.length > 0 && !(key in values)
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
                data={asBooleanString(label === itemKey)}/>
            <EditItemButtonComponent
                pageKey={params.page}
                root={`${params.field}.${itemKey}`}
                name={itemKey}
                deps={params.deps}/>
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
            onChange={handleInput}/>
    )
}

export default EditItemRecordComponent

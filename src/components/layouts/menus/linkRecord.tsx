import { useMemo } from 'react'
import LinkInput from '../linkInput'
import ListTemplateMenu, { type ListTemplateComponentProps } from './template'
import { asBooleanString, asObjectId, isObjectId, keysOf } from 'utils'
import { useFilesOfType } from 'utils/hooks/files'
import type { DocumentType } from 'structure/database'
import type DatabaseFile from 'structure/database/files'
import type { DocumentTypeMap } from 'structure/database/files/factory'
import type { EnumValue, ObjectId } from 'types'
import DropdownMenu from '../dropdownMenu'

interface ILinkRecordMenuTextProps {
    type: 'text'
    value: Record<ObjectId, string>
    defaultValue: string
    onChange?: (selection: Record<ObjectId, string>) => void
}

interface ILinkRecordMenuNumberProps {
    type: 'number'
    value: Record<ObjectId, number>
    defaultValue: number
    onChange?: (selection: Record<ObjectId, number>) => void
}

interface ILinkRecordMenuEnumProps {
    type: 'enum'
    defaultValue: EnumValue
    options: Record<EnumValue, React.ReactNode>
    value: Record<ObjectId, EnumValue>
    onChange?: (selection: Record<ObjectId, EnumValue>) => void
}

type LinkRecordMenuProps = React.PropsWithRef<{
    className?: string
    itemClassName?: string
    editClassName?: string
    allowedTypes: readonly DocumentType[]
    placeholder?: string
} & (ILinkRecordMenuTextProps | ILinkRecordMenuNumberProps | ILinkRecordMenuEnumProps)>

type RecordMenuComponentProps = React.PropsWithRef<{
    itemClassName?: string
    editClassName?: string
    ids: ObjectId[]
    files: Array<DocumentTypeMap[DocumentType] | null>
    allowedTypes: readonly DocumentType[]
    placeholder?: string
} & (ILinkRecordMenuTextProps | ILinkRecordMenuNumberProps | ILinkRecordMenuEnumProps)>

function LinkRecordMenu(props: LinkRecordMenuProps): React.ReactNode {
    const { className, value, defaultValue, onChange } = props
    const ids = useMemo(() => keysOf(value), [value])
    const [files] = useFilesOfType(ids, props.allowedTypes)

    const handleChange = (newValues: Array<string | null>): void => {
        if (onChange === undefined) {
            return
        }

        const transferred: Record<ObjectId, any> = { }
        for (const key of newValues) {
            if (!isObjectId(key)) {
                continue
            }
            transferred[key] = props.value[key] ?? defaultValue
        }

        onChange(transferred)
    }

    const handleValidate = (value: string | null): boolean => {
        return isObjectId(value) && !(value in props.value)
    }

    return (
        <ListTemplateMenu<string | null, string | null, RecordMenuComponentProps>
            className={className}
            defaultValue=''
            values={ids}
            addLast
            createValue={asObjectId}
            onChange={handleChange}
            validateInput={handleValidate}
            Component={ItemComponent}
            EditComponent={EditComponent}
            params={{ ...props, ids: ids, files: files }}/>
    )
}

function ItemComponent({ index, params }: ListTemplateComponentProps<string | null, string | null, RecordMenuComponentProps>): React.ReactNode {
    const id = params.ids[index] ?? null
    const file = params.files[index] ?? null
    const value = params.value[id] ?? ''

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        switch (params.type) {
            case 'number':
                params.onChange?.({ ...params.value, [id]: Number(e.target.value) })
                break
            case 'text':
                params.onChange?.({ ...params.value, [id]: String(e.target.value) })
                break
            default:
                break
        }
    }

    const handleValueChanged = (value: string): void => {
        switch (params.type) {
            case 'enum':
                params.onChange?.({ ...params.value, [id]: value })
                break
        }
    }

    return (
        <div className={params.itemClassName} error={asBooleanString(file === null)}>
            <span>{ file !== null ? file.getTitle() : 'Error' }</span>
            { (params.type === 'text' || params.type === 'number') &&
                <input type={params.type} value={String(value)} onChange={handleChange}/>
            }
            { params.type === 'enum' &&
                <DropdownMenu value={String(value)} values={params.options} onChange={handleValueChanged}/>
            }
        </div>
    )
}

function EditComponent({ value, onUpdate, params }: ListTemplateComponentProps<string | null, string | null, RecordMenuComponentProps>): React.ReactNode {
    const handleFileChanged = (file: DatabaseFile | null): void => {
        if (file !== null) {
            onUpdate('')
            if (params.type === 'text') {
                params.onChange?.({ ...params.value, [file.id]: params.defaultValue })
            } else {
                params.onChange?.({ ...params.value, [file.id]: params.defaultValue })
            }
        }
    }

    return (
        <LinkInput
            className={params.editClassName}
            value={String(value)}
            allowText={false}
            allowedTypes={params.allowedTypes}
            placeholder={params.placeholder}
            onChange={onUpdate}
            onFileChanged={handleFileChanged}/>
    )
}

export default LinkRecordMenu

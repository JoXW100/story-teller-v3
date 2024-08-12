import { useMemo } from 'react'
import Link from 'next/link'
import LinkInput from '../../controls/linkInput'
import ListTemplateMenu, { type ListTemplateComponentProps } from './template'
import { asBooleanString, isDefined, isObjectId } from 'utils'
import { useFilesOfType } from 'utils/hooks/files'
import Logger from 'utils/logger'
import Navigation from 'utils/navigation'
import type DatabaseStory from 'structure/database/story'
import type { DocumentType } from 'structure/database'
import type { DocumentTypeMap } from 'structure/database/files/factory'
import type { ObjectId } from 'types'

interface ListMenuPropsBase<T> {
    story: DatabaseStory
    className?: string
    itemClassName?: string
    editClassName?: string
    values: T[]
    allowedTypes: readonly DocumentType[]
    placeholder?: string
    disabled?: boolean
    onChange: (selection: T[]) => void
    validateInput?: (value: T, values: T[]) => boolean
}

interface ListMenuPropsWithText extends ListMenuPropsBase<string> {
    allowText: true
    parseText: (value: string) => DocumentTypeMap[DocumentType] | null
}

interface ListMenuProps extends ListMenuPropsBase<ObjectId> {
    allowText: false
    parseText?: (value: string) => DocumentTypeMap[DocumentType] | null
}

type LinkListMenuProps = React.PropsWithRef<ListMenuProps | ListMenuPropsWithText>
type LinkListMenuComponent = React.PropsWithRef<{
    story: DatabaseStory
    itemClassName?: string
    editClassName?: string
    files: Array<DocumentTypeMap[DocumentType] | null>
    allowedTypes: readonly DocumentType[]
    placeholder?: string
    allowText: boolean
    disabled: boolean
    onChange: (selection: Array<string | ObjectId>) => void
    parseText: (value: string) => DocumentTypeMap[DocumentType] | null
}>

function toNull(): null {
    return null
}

const LinkListMenu: React.FC<LinkListMenuProps> = (props) => {
    const ids = useMemo(() => props.values.map(id => isObjectId(id) ? id : null), [props.values])
    const [files, loading] = useFilesOfType(ids, props.allowedTypes)

    if (props.allowedTypes.length === 0) {
        Logger.throw('LinkListMenu', 'LinkListMenu with no accepted filetypes, expected at least one', props.allowedTypes)
    }

    const handleChange = (items: Array<string | ObjectId>): void => {
        if (props.allowText) {
            props.onChange(items)
        } else {
            props.onChange(items.reduce<ObjectId[]>((prev, value) => isObjectId(value) ? [...prev, value] : prev, []))
        }
    }

    const handleValidate = (value: string | ObjectId, values: Array<string | ObjectId>): boolean => {
        if (props.disabled === true) {
            return false
        }
        if (props.allowText) {
            return props.validateInput?.(value, values) ?? true
        } else {
            for (const id of values) {
                if (!isObjectId(id)) {
                    return false
                }
            }
            return isObjectId(value) && (props.validateInput?.(value, values as ObjectId[]) ?? true)
        }
    }

    return (
        <ListTemplateMenu<string, string, LinkListMenuComponent>
            className={props.className}
            defaultValue=''
            values={loading ? [] : props.values}
            createValue={String}
            onChange={handleChange}
            validateInput={handleValidate}
            Component={Component}
            EditComponent={EditComponent}
            params={{ story: props.story, files, itemClassName: props.itemClassName, editClassName: props.editClassName, allowedTypes: props.allowedTypes, allowText: true, placeholder: props.placeholder, disabled: props.disabled === true, onChange: handleChange, parseText: props.parseText ?? toNull }}
            addLast/>
    )
}

const Component: React.FC<ListTemplateComponentProps<string, string, LinkListMenuComponent>> = ({ value, params }) => {
    const { files, allowedTypes, allowText = false, itemClassName } = params
    const file = files.find((file) => file?.id === value)
    const valid = allowText || (isObjectId(value) && file?.type !== undefined && allowedTypes.includes(file.type))
    const name = valid && file?.type !== undefined && allowedTypes.includes(file.type)
        ? file.getTitle()
        : value
    return (
        <div className={itemClassName} error={asBooleanString(!valid)}>
            { isDefined(file)
                ? <Link href={Navigation.fileURL(file.id, file?.storyId)}>
                    <b>{name}</b>
                </Link>
                : <b>{name}</b>
            }
        </div>
    )
}

const EditComponent: React.FC<ListTemplateComponentProps<string, string, LinkListMenuComponent>> = ({ value, values, onUpdate, params }) => {
    const handleFileChanged = (file: DocumentTypeMap[DocumentType] | null): void => {
        if (file !== null) {
            onUpdate('')
            params.onChange([...values, file.id])
        }
    }

    return (
        <LinkInput
            className={params.editClassName}
            story={params.story}
            value={value}
            allowText={params.allowText}
            allowedTypes={params.allowedTypes}
            placeholder={params.placeholder}
            onChange={onUpdate}
            onFileChanged={handleFileChanged}
            parseText={params.parseText}
            disabled={params.disabled}/>
    )
}

export default LinkListMenu

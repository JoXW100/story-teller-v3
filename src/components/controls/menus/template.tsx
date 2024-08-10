import React, { useEffect, useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import EditIcon from '@mui/icons-material/EditSharp'
import MoveDownIcon from '@mui/icons-material/ArrowDropDownSharp'
import LocalizedText from 'components/controls/localizedText'
import styles from './template.module.scss'

export type ListTemplateComponentProps<A, B, P> = React.PropsWithoutRef<{
    value: B
    values: A[]
    index: number
    params: P
    onUpdate: (value: B) => void
}>

type ListTemplateMenuProps<A, B, P> = React.PropsWithoutRef<{
    className?: string
    values: A[]
    defaultValue: B
    params: P
    addLast?: boolean
    allowReorder?: boolean
    createValue: (value: B) => A
    validateInput?: (value: B, values: A[]) => boolean
    onChange?: (items: A[]) => void
    onEdit?: (item: A, items: A[], index: number) => void
    Component: React.FC<ListTemplateComponentProps<A, A, P>>
    EditComponent?: React.FC<ListTemplateComponentProps<A, B, P>>
}>

const ListTemplateMenu = <A, B, P>({ className, defaultValue, values, params, addLast = false, allowReorder = false, createValue, onChange, onEdit, validateInput, Component, EditComponent }: ListTemplateMenuProps<A, B, P>): React.ReactNode => {
    const [value, setValue] = useState<B>(defaultValue)

    const handleChange = (value: A, index: number): void => {
        const newValues = [...values]
        newValues[index] = value
        onChange?.(newValues)
    }

    const handleAdd = (): void => {
        onChange?.(addLast ? [...values, createValue(value)] : [createValue(value), ...values])
        setValue(defaultValue)
    }

    const handleRemove = (index: number): void => {
        onChange?.([...values.slice(0, index), ...values.slice(index + 1)])
    }

    const handleEdit = (index: number): void => {
        onEdit?.(values[index], values, index)
    }

    const handleMove = (index: number): void => {
        if ((index + 1) < values.length) {
            const result = [...values]
            result[index] = values[index + 1]
            result[index + 1] = values[index]
            onChange?.(result)
        }
    }

    useEffect(() => {
        setValue(defaultValue)
    }, [defaultValue])

    return (
        <div className={className !== undefined ? `${styles.main} ${className}` : styles.main}>
            { EditComponent !== undefined &&
                <div className={styles.addRow}>
                    <div className={styles.collection}>
                        <EditComponent
                            value={value}
                            values={values}
                            index={-1}
                            params={params}
                            onUpdate={setValue}/>
                    </div>
                    <button
                        className='center-flex fill-height square'
                        onClick={handleAdd}
                        disabled={!(validateInput?.(value, values ?? []) ?? true)}>
                        <AddIcon className='small-icon'/>
                    </button>
                </div>
            }
            <div className={styles.content}>
                { values?.map((value, index) => (
                    <div key={index} className={styles.row}>
                        <div className={styles.collection}>
                            <Component
                                value={value}
                                values={values}
                                index={index}
                                params={params}
                                onUpdate={(value) => { handleChange(value, index) }}/>
                        </div>
                        { allowReorder &&
                            <button className='center-flex fill-height square' onClick={() => { handleMove(index) }} disabled={index >= values.length - 1}>
                                <MoveDownIcon className='small-icon'/>
                            </button>
                        }{ onEdit !== undefined &&
                            <Tooltip title={<LocalizedText id='common-edit'/>}>
                                <button className='center-flex fill-height square' onClick={() => { handleEdit(index) }}>
                                    <EditIcon className='small-icon'/>
                                </button>
                            </Tooltip>
                        }{ EditComponent !== undefined &&
                            <Tooltip title={<LocalizedText id='common-remove'/>}>
                                <button className='center-flex fill-height square' onClick={() => { handleRemove(index) }}>
                                    <RemoveIcon className='small-icon'/>
                                </button>
                            </Tooltip>
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ListTemplateMenu

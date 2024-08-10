import { useContext, useMemo } from 'react'
import GroupItemComponent from './groupItem'
import { Context } from 'components/contexts/file'
import ListTemplateMenu, { type ListTemplateComponentProps } from 'components/controls/menus/template'
import ModifierDataFactory, { type ModifierData } from 'structure/database/files/modifier/factory'
import { isRecord, getRelativeFieldObject, asBooleanString, createField } from 'utils'
import Logger from 'utils/logger'
import styles from '../style.module.scss'
import { useLocalizedText } from 'utils/hooks/localization'
import EditItemButtonComponent from './editItemButton'
import { DocumentType } from 'structure/database'

type ModifiersInputComponentProps = React.PropsWithRef<{
    field: string
    fill?: boolean
}>

interface IEditModifiersParams {
    field: string
}

const ModifiersInputComponent: React.FC<ModifiersInputComponentProps> = ({ field, fill = false }) => {
    const [context, dispatch] = useContext(Context)
    const params = useMemo(() => ({
        field: field
    }), [field])

    if (!isRecord(context.file.data)) {
        Logger.throw('Editor.ModifiersInputComponent', 'Data of incorrect type', context.file.data)
        return null
    }

    const relative = getRelativeFieldObject(field, context.file.data)
    if (relative === null) {
        Logger.throw('Editor.ModifiersInputComponent', 'Failed to get relative field', field)
        return null
    }

    const values = relative.relative[relative.key]
    if (!Array.isArray(values)) {
        Logger.throw('Editor.ModifiersInputComponent', 'Relative field not of expected type', field, values)
        return null
    }

    const handleCreateValue = (value: string): ModifierData => {
        return ModifierDataFactory.create({ name: value })
    }

    const handleChange = (value: ModifierData[]): void => {
        dispatch.setData(field, value)
    }

    return (
        <GroupItemComponent
            className={styles.editList}
            data={asBooleanString(fill)}
            labelId='editor-modifiers'>
            <ListTemplateMenu
                values={values}
                defaultValue=''
                params={params}
                onChange={handleChange}
                createValue={handleCreateValue}
                Component={ItemComponent}
                EditComponent={EditComponent}/>
        </GroupItemComponent>
    )
}

function ItemComponent({ value, index, params }: ListTemplateComponentProps<ModifierData, ModifierData, IEditModifiersParams>): React.ReactNode {
    return (
        <div className={styles.editListItem}>
            <span>{value.name}</span>
            <EditItemButtonComponent
                pageKey={DocumentType.Modifier}
                root={createField(params.field, String(index))}
                name={value.name}/>
        </div>
    )
}

function EditComponent({ value, onUpdate }: ListTemplateComponentProps<ModifierData, string, IEditModifiersParams>): React.ReactNode {
    const placeholder = useLocalizedText('editor-modifierName-placeholder')
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        onUpdate(e.target.value)
    }

    return (
        <input
            className={styles.editListItem}
            value={value}
            placeholder={placeholder}
            onChange={handleChange}/>
    )
}

export default ModifiersInputComponent

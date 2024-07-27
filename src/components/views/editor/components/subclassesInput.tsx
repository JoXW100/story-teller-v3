import React, { useCallback, useContext, useMemo } from 'react'
import Tooltip from '@mui/material/Tooltip'
import GroupItemComponent from './groupItem'
import { Context } from 'components/contexts/file'
import LinkInput from 'components/controls/linkInput'
import LocalizedText from 'components/controls/localizedText'
import RecordMenu, { type RecordComponentProps } from 'components/controls/menus/record'
import { asBooleanString, asObjectId, isObjectId, keysOf } from 'utils'
import { useFilesOfType } from 'utils/hooks/files'
import { useLocalizedText } from 'utils/hooks/localization'
import { DocumentType } from 'structure/database'
import type CharacterData from 'structure/database/files/character/data'
import type ClassDocument from 'structure/database/files/class'
import type { ObjectId } from 'types'
import styles from '../style.module.scss'

type SubclassesInputComponentProps = React.PropsWithRef<{
    data: CharacterData
    fill?: boolean
}>

interface ISubclassComponentParams {
    data: CharacterData
    classes: Record<ObjectId, ClassDocument>
    update: (val: ObjectId | null, classId: ObjectId) => void
}

type SubclassComponentProps = RecordComponentProps<ObjectId | null, ISubclassComponentParams>

const AllowedTypes = [DocumentType.Class] as const
const SubclassesInputComponent: React.FC<SubclassesInputComponentProps> = ({ data, fill = false }) => {
    const [, dispatch] = useContext(Context)
    const classIds = useMemo(() => keysOf(data.classes), [data.classes])
    const subclasses = useMemo(() => {
        const result: Record<ObjectId, ObjectId | null> = {}
        for (const id of keysOf(data.classes)) {
            result[id] = asObjectId(data.subclasses[id])
        }
        return result
    }, [data.classes, data.subclasses])
    const [files] = useFilesOfType(classIds, AllowedTypes)
    const classes = useMemo(() => {
        const result: Record<ObjectId, ClassDocument> = {}
        for (const document of files) {
            if (document !== null) {
                result[document?.id] = document
            }
        }
        return result
    }, [files])

    const update = useCallback((val: ObjectId | null, classId: ObjectId): void => {
        if (val !== null) {
            dispatch.setData('subclasses', { ...data.subclasses, [classId]: val })
        } else {
            const { [classId]: _, ...rest } = data.subclasses
            dispatch.setData('subclasses', rest)
        }
    }, [data.subclasses, dispatch])

    const params = useMemo<ISubclassComponentParams>(() => ({
        data: data,
        classes: classes,
        update: update
    }), [data, classes, update])

    const handleChange = (selection: Record<string, ObjectId | null>): void => {
        const result: Record<ObjectId, ObjectId> = {}
        for (const key of keysOf(selection)) {
            const value = selection[key]
            if (isObjectId(key) && isObjectId(value)) {
                result[key] = value
            }
        }
        dispatch.setData('subclasses', result)
    }

    return (
        <GroupItemComponent
            className={styles.editList}
            data={asBooleanString(fill)}
            labelId='editor-subclasses'>
            <RecordMenu<ObjectId | null, ISubclassComponentParams>
                itemClassName={styles.itemListItem}
                values={subclasses}
                defaultValue={null}
                onChange={handleChange}
                params={params}
                Component={SubclassComponent}/>
        </GroupItemComponent>
    )
}

const AllowedSubTypes = [DocumentType.Subclass] as const
const SubclassComponent: React.FC<SubclassComponentProps> = ({ value, itemKey, params }) => {
    const classId = itemKey as ObjectId
    const classFile = params.classes[classId] as ClassDocument | undefined
    const placeholder = useLocalizedText('editor-subclass-placeholder')

    return (
        <div className={styles.editSubclassItem}>
            <Tooltip title={<LocalizedText id='empty' args={[classFile?.getTitle() ?? '...']}/>}>
                <b>{classFile?.getTitle()}</b>
            </Tooltip>
            <LinkInput
                className={styles.editInput}
                value={value}
                placeholder={placeholder}
                allowedTypes={AllowedSubTypes}
                parentFile={classId}
                allowText={false}
                onChange={(value) => { params.update(asObjectId(value), classId) }}
                disabled={Number(classFile?.data.subclassLevel ?? 1) > Number(params.data.classes[classId] ?? 1)}/>
        </div>
    )
}

export default SubclassesInputComponent

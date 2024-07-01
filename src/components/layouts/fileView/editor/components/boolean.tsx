import React, { useContext } from 'react'
import { Context, getRelativeFieldObject } from 'components/contexts/file'
import Checkbox from 'components/layouts/checkbox'
import GroupItemComponent from './groupItem'
import { isRecord } from 'utils'
import Logger from 'utils/logger'
import type { LanguageKey } from 'data'
import styles from '../style.module.scss'

type BooleanComponentParams = React.PropsWithoutRef<{
    field: string
    labelId: LanguageKey
    labelArgs?: any[]
    deps?: string[]
}>

const BooleanComponent: React.FC<BooleanComponentParams> = ({ field, labelId, labelArgs, deps = [] }) => {
    const [context, dispatch] = useContext(Context)
    if (!isRecord(context.file.data)) {
        Logger.throw('Editor.BooleanComponent', 'Data of incorrect type', context.file.data)
        return null
    }

    const relative = getRelativeFieldObject(field, context.file.data)
    if (relative === null) {
        Logger.throw('Editor.BooleanComponent', 'Failed to get relative field', field)
        return null
    }

    const value = relative.relative[relative.key]
    if (typeof value !== 'boolean') {
        Logger.throw('Editor.BooleanComponent', 'Relative field not of expected type', field, value)
        return null
    }

    const handleInput = (value: boolean): void => {
        dispatch.setData(field, value, deps)
    }

    return (
        <GroupItemComponent labelId={labelId} labelArgs={labelArgs} className={styles.editBoolean}>
            <Checkbox value={value} onChange={handleInput}/>
        </GroupItemComponent>
    )
}

export default BooleanComponent

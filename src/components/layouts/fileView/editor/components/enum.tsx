import React, { useContext } from 'react'
import DropdownMenu from 'components/layouts/dropdownMenu'
import { Context, getRelativeFieldObject } from 'components/contexts/file'
import { type OptionTypeKey, getOptionType } from 'structure/optionData'
import GroupItemComponent from './groupItem'
import { isEnum, isRecord } from 'utils'
import Logger from 'utils/logger'
import type { LanguageKey } from 'data'
import styles from '../style.module.scss'

type EnumComponentParams = React.PropsWithoutRef<{
    field: string
    type: OptionTypeKey
    labelId: LanguageKey
    labelArgs?: any[]
    deps?: string[]
}>

const EnumComponent: React.FC<EnumComponentParams> = ({ field, type, labelId, labelArgs, deps = [] }) => {
    const [context, dispatch] = useContext(Context)
    if (!isRecord(context.file.data)) {
        Logger.throw('Editor.NumberComponent', 'Data of incorrect type', context.file.data)
        return null
    }

    const relative = getRelativeFieldObject(field, context.file.data)
    if (relative === null) {
        Logger.throw('Editor.EnumComponent', 'Failed to get relative field', field)
        return null
    }

    const option = getOptionType(type)
    if (option === null) {
        Logger.throw('Editor.EnumComponent', 'No option type of type: ' + type, field)
        return null
    }

    const value = relative.relative[relative.key]
    if (!isEnum(value, option.enum)) {
        Logger.throw('Editor.EnumComponent', 'Relative field not of expected type', relative.relative, relative.key, value, option)
        return null
    }

    const handleInput = (x: typeof value): void => {
        dispatch.setData(field, x, deps)
    }

    return (
        <GroupItemComponent labelId={labelId} labelArgs={labelArgs}>
            <DropdownMenu<typeof value>
                className={styles.dropdown}
                itemClassName={styles.dropdownItem}
                values={option.options}
                value={value}
                onChange={handleInput}/>
        </GroupItemComponent>
    )
}

export default EnumComponent

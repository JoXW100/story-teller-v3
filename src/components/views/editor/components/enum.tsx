import React, { useContext } from 'react'
import GroupItemComponent from './groupItem'
import DropdownMenu from 'components/controls/dropdownMenu'
import { Context } from 'components/contexts/file'
import { type OptionTypeKey, getOptionType } from 'structure/optionData'
import type { LanguageKey } from 'assets'
import { isEnum, isRecord, getRelativeFieldObject } from 'utils'
import Logger from 'utils/logger'
import { useLocalizedOptions } from 'utils/hooks/localization'
import styles from '../style.module.scss'

type EnumComponentParams = React.PropsWithoutRef<{
    field: string
    type: OptionTypeKey
    labelId: LanguageKey
    labelArgs?: any[]
}>

const EnumComponent: React.FC<EnumComponentParams> = ({ field, type, labelId, labelArgs }) => {
    const [context, dispatch] = useContext(Context)
    const options = useLocalizedOptions(type)

    if (!isRecord(context.file.data)) {
        Logger.throw('Editor.NumberComponent', 'Data of incorrect type', context.file.data)
        return null
    }

    const relative = getRelativeFieldObject(field, context.file.data)
    if (relative === null) {
        Logger.throw('Editor.EnumComponent', 'Failed to get relative field', field)
        return null
    }

    const value = relative.relative[relative.key]
    if (!isEnum(value, getOptionType(type).enum)) {
        Logger.throw('Editor.EnumComponent', 'Relative field not of expected type', relative.relative, relative.key, value)
        return null
    }

    const handleInput = (x: typeof value): void => {
        dispatch.setData(field, x)
    }

    return (
        <GroupItemComponent labelId={labelId} labelArgs={labelArgs}>
            <DropdownMenu<typeof value>
                className={styles.dropdown}
                itemClassName={styles.dropdownItem}
                values={options}
                value={value}
                onChange={handleInput}/>
        </GroupItemComponent>
    )
}

export default EnumComponent
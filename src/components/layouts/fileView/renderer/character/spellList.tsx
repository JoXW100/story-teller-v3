import { useState } from 'react'
import RemoveIcon from '@mui/icons-material/Remove'
import PrepareIcon from '@mui/icons-material/ImportContactsSharp'
import { Tooltip } from '@mui/material'
import LocalizedText from 'components/localizedText'
import CollapsibleGroup from 'components/layouts/collapsibleGroup'
import { asBooleanString, keysOf } from 'utils'
import { getSpellLevelValue } from 'utils/calculations'
import type { SpellData } from 'structure/database/files/spell/factory'
import { SpellLevel } from 'structure/dnd'
import type { ObjectId } from 'types'
import styles from '../styles.module.scss'

type SpellListProps = React.PropsWithRef<{
    header: React.ReactNode
    spells: Record<ObjectId, SpellData>
    maxLevel?: SpellLevel
    validate: (id: ObjectId) => boolean
    handleRemove: (id: ObjectId) => void
    handlePrepare?: (id: ObjectId) => void
    removeIsDisabled?: (id: ObjectId) => boolean
    prepareIsDisabled?: (id: ObjectId) => boolean
}>

const SpellList: React.FC<SpellListProps> = ({ header, spells, maxLevel = SpellLevel.Cantrip, validate, handleRemove, handlePrepare, removeIsDisabled, prepareIsDisabled }) => {
    const [filter, setFilter] = useState<boolean[]>([])

    const handleFilterCLick = (index: number): void => {
        const newFilter = [...filter]
        newFilter[index] = !(newFilter[index] ?? true)
        setFilter(newFilter)
    }

    const spellFilter = (id: ObjectId): boolean => {
        return id in spells && (filter[spells[id].levelValue - 1] ?? true)
    }

    const spellSort = (a: ObjectId, b: ObjectId): number => {
        const spellA = spells[a]
        const spellB = spells[b]
        const levelDiff = spellA.levelValue - spellB.levelValue
        if (levelDiff !== 0) {
            return levelDiff
        }
        return spellA.name.localeCompare(spellB.name)
    }

    return (
        <CollapsibleGroup header={header}>
            { maxLevel !== SpellLevel.Cantrip && Object.keys(spells).length > 0 &&
                <div className={styles.spellFilterMenu}>
                    <b>Filter: </b>
                    { Array.from({ length: getSpellLevelValue(maxLevel) }).map((_, index) => (
                        <Tooltip key={index} title={<LocalizedText id={filter[index] ?? true ? 'common-disable' : 'common-enable'}/>}>
                            <button
                                className={styles.spellFilterMenuItem}
                                data={asBooleanString(filter[index] ?? true)}
                                onClick={() => { handleFilterCLick(index) }}>
                                {index + 1}
                            </button>
                        </Tooltip>
                    ))}
                </div>
            }
            { keysOf(spells)
                .filter(spellFilter)
                .sort(spellSort)
                .map((id) =>
                    <SpellListItem
                        key={id}
                        data={spells[id]}
                        removeIsDisabled={removeIsDisabled?.(id)}
                        prepareIsDisabled={prepareIsDisabled?.(id)}
                        handleRemove={() => { handleRemove(id) }}
                        handlePrepare={handlePrepare !== undefined ? () => { handlePrepare(id) } : undefined}
                        isValid={validate(id)}/>
                )}
        </CollapsibleGroup>
    )
}

type SpellListItemProps = React.PropsWithRef<{
    data: SpellData
    removeIsDisabled?: boolean
    prepareIsDisabled?: boolean
    isValid?: boolean
    handleRemove: () => void
    handlePrepare?: () => void
}>

const SpellListItem = ({ data, removeIsDisabled, prepareIsDisabled, handleRemove, handlePrepare, isValid = false }: SpellListItemProps): JSX.Element => {
    return (
        <div className={styles.spellItem} error={asBooleanString(!isValid)}>
            <b>{data.name}: </b>
            <span>{data.levelText}</span>
            <span>{data.schoolName}</span>
            <span/>
            { handlePrepare !== undefined &&
                <Tooltip title={<LocalizedText id='render-spellList-prepare'/>}>
                    <span>
                        <button
                            className='small-icon fill-height'
                            disabled={prepareIsDisabled}
                            onClick={handlePrepare}>
                            <PrepareIcon/>
                        </button>
                    </span>
                </Tooltip>
            }
            <Tooltip title={<LocalizedText id='common-remove'/>}>
                <span>
                    <button
                        className='small-icon fill-height'
                        disabled={removeIsDisabled}
                        onClick={handleRemove}>
                        <RemoveIcon/>
                    </button>
                </span>
            </Tooltip>
        </div>
    )
}

export default SpellList

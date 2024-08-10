import { useContext, useMemo } from 'react'
import { Tooltip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EncounterCardRenderer from './card'
import { Context } from 'components/contexts/file'
import Loading from 'components/controls/loading'
import Elements, { ElementDictionary } from 'components/elements'
import LocalizedText from 'components/controls/localizedText'
import CollapsibleGroup from 'components/controls/collapsibleGroup'
import { isNumber, isString, keysOf } from 'utils'
import { useFilesOfType } from 'utils/hooks/files'
import { DocumentType } from 'structure/database'
import EncounterCard from 'structure/database/files/encounter/card'
import type EncounterDocument from 'structure/database/files/encounter'
import type CharacterDocument from 'structure/database/files/character'
import type CreatureDocument from 'structure/database/files/creature'
import { Die } from 'structure/dice/die'
import { RandomInstance } from 'structure/random'
import type { DragData } from 'types/dom'
import styles from '../styles.module.scss'

const FileTypes = [DocumentType.Creature, DocumentType.Character] as const

const EncounterDocumentRenderer: React.FC = (): React.ReactNode => {
    const [context, dispatch] = useContext(Context)
    const encounter = context.file as EncounterDocument
    const descriptionToken = useMemo(() => {
        return context.file.getTokenizedDescription(ElementDictionary)
    }, [context.file])
    const creatureIds = useMemo(() => keysOf(encounter.data.creatures), [encounter.data.creatures])
    const [creatures, loading] = useFilesOfType(creatureIds, FileTypes)

    const [groups, other, hasUngrouped] = useMemo(() => {
        const other: Record<string, CharacterDocument | CreatureDocument> = {}
        const groups: Record<string, Record<string, CharacterDocument | CreatureDocument>> = {}
        let hasUngrouped = false
        for (const group of encounter.storage.groups) {
            groups[group] = {}
        }
        for (const creature of creatures) {
            if (creature !== null) {
                for (let i = 0; i < encounter.data.creatures[creature.id]; i++) {
                    const key = `${creature.id}.${i}`
                    if (key in encounter.storage.cards) {
                        const card = encounter.storage.cards[key]
                        if (isNumber(card.group)) {
                            const group = encounter.storage.groups[card.group]
                            if (group !== undefined) {
                                groups[group][key] = creature
                                continue
                            }
                        }
                    }
                    other[key] = creature
                    hasUngrouped = true
                }
            }
        }
        return [groups, other, hasUngrouped]
    }, [creatures, encounter.data.creatures, encounter.storage.cards, encounter.storage.groups])

    const handleReset = (): void => {
        const value: Record<string, EncounterCard> = {}
        for (const key of keysOf(encounter.storage.cards)) {
            value[key] = new EncounterCard({ group: encounter.storage.cards[key].group })
        }
        dispatch.setStorage('cards', value)
    }

    const handleRollInitiative = (): void => {
        const value: Record<string, EncounterCard> = {}
        const die = new Die(20)
        for (const creature of creatures) {
            if (creature !== null) {
                for (let i = 0; i < encounter.data.creatures[creature.id]; i++) {
                    const key = `${creature.id}.${i}`
                    value[key] = new EncounterCard({ ...encounter.storage.cards[key] ?? {}, initiative: die.rollOnceValue() })
                }
            }
        }
        dispatch.setStorage('cards', value)
    }

    const handleRollHealth = (): void => {
        const value: Record<string, EncounterCard> = {}
        for (const creature of creatures) {
            if (creature !== null) {
                for (let i = 0; i < encounter.data.creatures[creature.id]; i++) {
                    const key = `${creature.id}.${i}`
                    value[key] = new EncounterCard({ ...encounter.storage.cards[key] ?? {}, randomMaxHealth: RandomInstance.random_int() })
                }
            }
        }
        dispatch.setStorage('cards', value)
    }

    const handleAddGroup = (): void => {
        dispatch.setStorage('groups', [...encounter.storage.groups, 'Group Name...'])
    }

    const handleRemoveGroup = (index: number): void => {
        const cards: Record<string, EncounterCard> = {}
        for (const key of keysOf(encounter.storage.cards)) {
            const card = encounter.storage.cards[key]
            if (card.group !== index) {
                cards[key] = card
            }
        }
        dispatch.setStorage('cards', cards)
        dispatch.setStorage('groups', [...encounter.storage.groups.slice(0, index), ...encounter.storage.groups.slice(index + 1)])
    }

    const handleRenameGroup = (name: string, index: number): void => {
        dispatch.setStorage('groups', [...encounter.storage.groups.slice(0, index), name, ...encounter.storage.groups.slice(index + 1)])
    }

    const handleDrag = (dragData: DragData, index: number): boolean => {
        return isString(dragData.target) && encounter.storage.cards[dragData.target]?.group !== index
    }

    const handleDrop = (dragData: DragData, index: number): void => {
        if (isString(dragData.target) && dragData.target in encounter.storage.cards) {
            const card = new EncounterCard({ ...encounter.storage.cards[dragData.target], group: index })
            dispatch.setStorage('cards', { ...encounter.storage.cards, [dragData.target]: card })
            dragData.target = undefined
        }
    }

    return <>
        <Elements.h1 underline>{encounter.data.name}</Elements.h1>
        <Elements.align direction='h' weight={null} width={null}>
            <button className={styles.encounterButton} onClick={handleReset}>
                Reset
            </button>
            <Elements.space/>
            <button className={styles.encounterButton} onClick={handleRollInitiative} disabled={creatures.length === 0}>
                Roll Initiative
            </button>
            <Elements.space/>
            <button className={styles.encounterButton} onClick={handleRollHealth} disabled={creatures.length === 0}>
                Roll Health
            </button>
        </Elements.align>
        <Elements.line width='2px'/>
        { !descriptionToken.isEmpty &&
            <>
                <Elements.h2 underline={false}>Description</Elements.h2>
                <div>{descriptionToken.build()}</div>
            </>
        }
        <Elements.space/>
        <div><Elements.b>Challenge: </Elements.b>{encounter.data.challengeText}</div>
        <Elements.line width='2px'/>
        <Elements.align direction='v' weight={null} width={null}>
            <Loading loaded={!loading}>
                { hasUngrouped &&
                    <div className={styles.encounterCardHolder}>
                        { keysOf(other).map((key) => {
                            return (
                                <EncounterCardRenderer
                                    id={key}
                                    key={key}
                                    encounter={encounter}
                                    creature={other[key]}/>
                            )
                        })}
                    </div>
                }
                { keysOf(groups).map((group, index) => (
                    <CollapsibleGroup
                        key={group}
                        header={group}
                        onDrag={(data) => handleDrag(data, index)}
                        onDrop={(data) => { handleDrop(data, index) }}
                        onChange={(value) => { handleRenameGroup(value, index) }}
                        onRemove={() => { handleRemoveGroup(index) }}>
                        <div className={styles.encounterCardHolder}>
                            { keysOf(groups[group]).map((key) =>
                                <EncounterCardRenderer
                                    id={key}
                                    key={key}
                                    encounter={encounter}
                                    creature={groups[group][key]}/>
                            )}
                        </div>
                    </CollapsibleGroup>
                ))}
            </Loading>
        </Elements.align>
        <Elements.space/>
        <Tooltip title={<LocalizedText id='render-createNewGroup'/>}>
            <div>
                <button className={styles.encounterAddGroupButton} onClick={handleAddGroup}>
                    <AddIcon className='icon-small'/>
                </button>
            </div>
        </Tooltip>
    </>
}

export default EncounterDocumentRenderer

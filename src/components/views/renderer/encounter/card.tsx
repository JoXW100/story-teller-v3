import { useContext, useMemo } from 'react'
import Link from 'next/link'
import { Tooltip } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Loop'
import Elements from 'components/elements'
import { Context } from 'components/contexts/file'
import LocalizedText from 'components/controls/localizedText'
import Navigation from 'utils/navigation'
import { useCharacterCreatureFacade } from 'utils/hooks/documents'
import { asBooleanString, isDefined, isNumber } from 'utils'
import Beyond20 from 'utils/beyond20'
import EncounterCard from 'structure/database/files/encounter/card'
import type CreatureDocument from 'structure/database/files/creature'
import type CharacterDocument from 'structure/database/files/character'
import type EncounterDocument from 'structure/database/files/encounter'
import { EncounterCardFactory } from 'structure/database/files/encounter/factory'
import { RollMethodType, RollType } from 'structure/dice'
import { Die } from 'structure/dice/die'
import { ModifiedDice } from 'structure/dice/modified'
import styles from '../styles.module.scss'
import Random from 'structure/random'
import DiceFactory from 'structure/dice/factory'

type EncounterCardProps = React.PropsWithRef<{
    id: string
    encounter: EncounterDocument
    creature: CreatureDocument | CharacterDocument
}>

const EncounterCardRenderer: React.FC<EncounterCardProps> = ({ id, encounter, creature }) => {
    const [, dispatch] = useContext(Context)
    const { facade } = useCharacterCreatureFacade(creature)
    const card = encounter.storage.cards[id] ?? EncounterCardFactory.create()
    const initiativeBonus = facade.initiativeValue
    const initiative = isNumber(card.initiative) ? card.initiative + initiativeBonus : 0
    const count = encounter.data.creatures[creature.id]
    const order = -initiative * 100 - initiativeBonus

    const maxHealth = useMemo<number>(() => {
        if (isNumber(card.randomMaxHealth)) {
            const dice = DiceFactory.parse(facade.healthRoll)
            if (dice !== null) {
                const random = new Random(card.randomMaxHealth)
                return dice.rollOnceValue(random)
            }
        }
        return facade.healthValue
    }, [card.randomMaxHealth, facade])

    const onNotesChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        const notes: string = e.currentTarget.value
        dispatch.setStorage('cards', { ...encounter.storage.cards, [id]: new EncounterCard({ ...card, notes }) })
    }

    const handleHealthChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const value = parseInt(e.currentTarget.value)
        const health: number = Math.max(0, isNaN(value) ? card.health : value)
        dispatch.setStorage('cards', { ...encounter.storage.cards, [id]: new EncounterCard({ ...card, health }) })
    }

    const handleRollInitiative: React.MouseEventHandler<HTMLButtonElement> = () => {
        const collection = new ModifiedDice(new Die(20), initiativeBonus)
        const result = collection.roll()
        Beyond20.sendRoll({
            method: RollMethodType.Normal,
            result: result,
            type: RollType.Initiative,
            source: creature.name
        })
        dispatch.setStorage('cards', { ...encounter.storage.cards, [id]: new EncounterCard({ ...card, initiative: result.rolls[result.selected].sum - initiativeBonus }) })
    }

    const handleDragStart: React.MouseEventHandler = (e): void => {
        const child = e.currentTarget.children.item(1)
        if (isDefined(child) && child.id === 'drag-handle') {
            const rect = child.getBoundingClientRect()
            if (e.clientX >= rect.x && e.clientX <= rect.x + rect.width &&
                e.clientY >= rect.y && e.clientY <= rect.y + rect.height) {
                window.dragData = { target: id }
                return
            }
        }
        e.preventDefault()
    }

    return (
        <div className={styles.encounterCard} style={{ order: order }} onDragStart={handleDragStart} draggable>
            <div className={styles.encounterCardToken} data={asBooleanString(count > 0)}>
                { Number(id.substring(id.lastIndexOf('.') + 1)) + 1 }
            </div>
            <Link id='drag-handle' href={Navigation.fileURL(creature.id)} rel='noopener noreferrer' target="_blank" draggable={false}>
                <button className={styles.encounterCardHeader} onDragStart={handleDragStart}>
                    {facade.name}
                </button>
            </Link>
            <div className={styles.encounterCardPortrait} >
                <img className='fill-width' src={facade.portrait} alt='/defaultImage.jpg' draggable={false}/>
            </div>
            <div className={styles.encounterCardRow}>
                <Elements.b>Initiative:</Elements.b>
                { `${initiative} (${initiativeBonus >= 0 ? `+${initiativeBonus}` : initiativeBonus})` }
                <Tooltip title={<LocalizedText id='render-roll'/>}>
                    <button onClick={handleRollInitiative}>
                        <RefreshIcon className='fill'/>
                    </button>
                </Tooltip>
            </div>
            <div className={styles.encounterCardInputRow}>
                <Elements.b>HP:</Elements.b>
                <input
                    className={styles.encounterCardInput}
                    type="number"
                    value={isNumber(card.health) ? card.health : maxHealth}
                    onChange={handleHealthChange}/>
                {` / ${maxHealth}`}
            </div>
            <div className={styles.encounterCardRow}>
                <Elements.b>AC:</Elements.b>
                { facade.acValue }
            </div>
            <textarea
                className={styles.encounterCardTextarea}
                value={card.notes}
                onChange={onNotesChange}
                placeholder="Input notes here ..."/>
        </div>
    )
}

export default EncounterCardRenderer

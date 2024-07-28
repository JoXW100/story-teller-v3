import { useMemo, useState } from 'react'
import SpellRenderer from './spell'
import SpellClosedRenderer from './closed'
import { asBooleanString } from 'utils'
import { EmptyBonusGroup, EmptyProperties } from 'structure/database'
import SpellDataBase from 'structure/database/files/spell/data'
import SpellDataFactory, { type SpellData } from 'structure/database/files/spell/factory'
import type { IBonusGroup, IProperties } from 'types/editor'
import type { ISpellData } from 'types/database/files/spell'
import styles from '../styles.module.scss'

type SpellToggleRendererProps = React.PropsWithRef<{
    data: ISpellData
    properties?: IProperties
    attackBonuses?: IBonusGroup
    damageBonuses?: IBonusGroup
    startCollapsed?: boolean
}>

export const SpellToggleRenderer: React.FC<SpellToggleRendererProps> = ({ data, properties = EmptyProperties, attackBonuses = EmptyBonusGroup, damageBonuses = EmptyBonusGroup, startCollapsed = false }) => {
    const [open, setOpen] = useState(!startCollapsed)

    const spell = useMemo(() =>
        data instanceof SpellDataBase
            ? data as SpellData
            : SpellDataFactory.create(data)
    , [data])

    const handleClick = (): void => {
        setOpen((open) => !open)
    }

    const Renderer = open ? SpellRenderer : SpellClosedRenderer

    return (
        <div
            className={styles.rendererBox}
            data={asBooleanString(open)}
            onClick={handleClick}>
            <Renderer
                data={spell}
                properties={properties}
                attackBonuses={attackBonuses}
                damageBonuses={attackBonuses}/>
        </div>
    )
}

export default SpellToggleRenderer

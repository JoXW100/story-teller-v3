import { useMemo, useState } from 'react'
import { AbilityRenderer } from '.'
import { asBooleanString } from 'utils'
import AbilityDataBase from 'structure/database/files/ability/data'
import AbilityDataFactory, { type AbilityData } from 'structure/database/files/ability/factory'
import type { ObjectId } from 'types'
import type { IAbilityData } from 'types/database/files/ability'
import type { IBonusGroup, ICreatureStats } from 'types/editor'
import styles from '../styles.module.scss'

type AbilityLinkRendererProps = React.PropsWithRef<{
    id: ObjectId | string
    data: IAbilityData
    stats?: ICreatureStats
    classLevel?: number
    attackBonuses?: IBonusGroup
    damageBonuses?: IBonusGroup
    expendedCharges?: number
    setExpendedCharges?: (value: number) => void
    startCollapsed?: boolean
}>

export const AbilityToggleRenderer: React.FC<AbilityLinkRendererProps> = ({ id, data, stats, classLevel, attackBonuses, damageBonuses, startCollapsed = false, expendedCharges, setExpendedCharges }) => {
    const [open, setOpen] = useState(!startCollapsed)

    const ability = useMemo(() =>
        data instanceof AbilityDataBase
            ? data as AbilityData
            : AbilityDataFactory.create(data)
    , [data])

    const handleClick = (): void => {
        setOpen((value) => !value)
    }

    return (
        <div
            className={styles.rendererBox}
            data={asBooleanString(open)}
            onClick={handleClick}>
            <AbilityRenderer
                id={id}
                data={ability}
                stats={stats}
                classLevel={classLevel}
                attackBonuses={attackBonuses}
                damageBonuses={damageBonuses}
                open={open}
                expendedCharges={expendedCharges}
                setExpendedCharges={setExpendedCharges}/>
        </div>
    )
}

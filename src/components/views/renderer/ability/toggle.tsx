import { useMemo, useState } from 'react'
import { AbilityRenderer } from '.'
import { asBooleanString } from 'utils'
import AbilityDataBase from 'structure/database/files/ability/data'
import AbilityDataFactory, { type AbilityData } from 'structure/database/files/ability/factory'
import type { IAbilityData } from 'types/database/files/ability'
import type { IBonusGroup, IProperties } from 'types/editor'
import styles from '../styles.module.scss'

type AbilityLinkRendererProps = React.PropsWithRef<{
    data: IAbilityData
    properties: IProperties
    attackBonuses?: IBonusGroup
    damageBonuses?: IBonusGroup
    expendedCharges?: number
    setExpendedCharges?: (value: number) => void
    startCollapsed?: boolean
}>

export const AbilityToggleRenderer: React.FC<AbilityLinkRendererProps> = ({ data, properties, attackBonuses, damageBonuses, startCollapsed = false, expendedCharges, setExpendedCharges }) => {
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
                data={ability}
                properties={properties}
                attackBonuses={attackBonuses}
                damageBonuses={damageBonuses}
                open={open}
                expendedCharges={expendedCharges}
                setExpendedCharges={setExpendedCharges}/>
        </div>
    )
}

import { useMemo, useState } from 'react'
import { AbilityRenderer } from '.'
import { asBooleanString } from 'utils'
import AbilityDataBase from 'structure/database/files/ability/data'
import AbilityDataFactory, { type AbilityData } from 'structure/database/files/ability/factory'
import type { ObjectId } from 'types'
import type { IAbilityData } from 'types/database/files/ability'
import type { ICreatureStats } from 'types/editor'
import styles from '../styles.module.scss'

type AbilityLinkRendererProps = React.PropsWithRef<{
    id: ObjectId | string
    data: IAbilityData
    stats?: ICreatureStats
    expendedCharges?: number
    setExpendedCharges?: (value: number) => void
    startCollapsed?: boolean
}>

export const AbilityLinkRenderer: React.FC<AbilityLinkRendererProps> = ({ id, data, stats, startCollapsed = false, expendedCharges, setExpendedCharges }) => {
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
                open={open}
                expendedCharges={expendedCharges}
                setExpendedCharges={setExpendedCharges}/>
        </div>
    )
}

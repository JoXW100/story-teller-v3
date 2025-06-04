import { useContext, useState } from 'react'
import { Tooltip } from '@mui/material'
import IconMap from 'assets/icons'
import { Context } from 'components/contexts/roll'
import { DieType, RollMethodType, RollType } from 'structure/dice'
import Icon from '../icon'
import LocalizedText from '../localizedText'
import { asBooleanString, asKeyOf, keysOf } from 'utils'
import { DiceGroup } from 'structure/dice/group'
import { createDiceRollResult } from 'structure/dice/rolling'
import styles from './style.module.scss'

type DicePanelProps = React.PropsWithRef<{ open: boolean }>

const DicePanel = ({ open }: DicePanelProps): JSX.Element => {
    const [, dispatch] = useContext(Context)
    const [state, setState] = useState<Partial<Record<DieType, number>>>({})

    const handleClick = (type: DieType): void => {
        setState(state => ({ ...state, [type]: (state[type] ?? 0) + 1 }))
    }

    const handleRoll = (): void => {
        const collection = new DiceGroup()
        for (const type of keysOf(state)) {
            collection.addDiceOfType(type, state[type])
        }
        dispatch.roll({
            method: RollMethodType.Normal,
            result: createDiceRollResult(collection),
            type: RollType.Generic,
            description: 'Roll'
        })
        setState({})
    }

    const filterDieTypes = (type: DieType): boolean => {
        if (type in IconMap) {
            switch (type) {
                case DieType.DX:
                    return false
                default:
                    return true
            }
        }
        return false
    }

    return (
        <div className={styles.holder} data={asBooleanString(open)}>
            { Object.keys(state).length > 0 && (
                <div className={styles.rollBackground}>
                    <Tooltip title={<LocalizedText id='dicePanel-roll-tooltips'/>}>
                        <button className={styles.roll} onClick={handleRoll}>
                            <LocalizedText id='dicePanel-roll'/>
                        </button>
                    </Tooltip>
                </div>
            )}
            <div className={styles.main}>
                { Object.values(DieType).filter(filterDieTypes).map((type) => (
                    <Tooltip key={type} title={type}>
                        <button
                            className={styles.dice}
                            onClick={() => { handleClick(type) }}>
                            <Icon className='square icon-small' icon={asKeyOf(type, IconMap, 'dx')}/>
                            { type in state &&
                                <div className={styles.number}>
                                    {state[type]}
                                </div>
                            }
                        </button>
                    </Tooltip>
                ))}
            </div>
        </div>
    )
}

export default DicePanel

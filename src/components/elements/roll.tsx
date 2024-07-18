import { useContext, useMemo } from 'react'
import { Tooltip } from '@mui/material'
import { D20Icon } from 'assets/dice'
import Icon from 'components/icon'
import { openContext } from 'components/layouts/contextMenu'
import { Context } from 'components/contexts/story'
import { Context as FileContext } from 'components/contexts/file'
import { type DiceBase, RollMethodType, RollType } from 'structure/dice'
import { Die } from 'structure/dice/die'
import DiceFactory from 'structure/dice/factory'
import { ModifiedDice } from 'structure/dice/modified'
import RollElement, { type RollElementParams } from 'structure/elements/roll'
import styles from './styles.module.scss'

const RollComponent: React.FC<RollElementParams> = ({ children, dice, critRange, mode, type, desc, details, tooltips }) => {
    const [, dispatch] = useContext(Context)
    const [context] = useContext(FileContext)
    const [diceObject, text] = useMemo(() => {
        const flag = RollElement.simplifyDiceMatcher.test(dice)
        let die: DiceBase | null = flag
            ? DiceFactory.parse(`1d20+${dice}`)
            : DiceFactory.parse(dice)
        die ??= Die.None
        return [die, flag ? ModifiedDice.stringify(die.modifier) : die.stringify()]
    }, [dice])

    const roll = (method: RollMethodType): void => {
        dispatch.roll({
            method: method,
            result: diceObject.roll(method),
            type: type,
            critRange: critRange,
            description: desc,
            details: details,
            source: ('name' in context.file.data ? context.file.data.name as string : undefined)
        })
    }

    const handleContext: React.MouseEventHandler<HTMLSpanElement> = (e) => {
        e.preventDefault()
        e.stopPropagation()
        openContext(type === RollType.Damage
            ? [
                {
                    text: 'roll-normal',
                    icon: <D20Icon/>,
                    action: () => { roll(RollMethodType.Normal) }
                },
                {
                    text: 'roll-crit',
                    icon: <Icon icon='crit'/>,
                    action: () => { roll(RollMethodType.SumOfTwo) }
                }
            ]
            : [
                {
                    text: 'roll-normal',
                    icon: <D20Icon/>,
                    action: () => { roll(RollMethodType.Normal) }
                },
                {
                    text: 'roll-advantage',
                    icon: <Icon icon='advantage'/>,
                    action: () => { roll(RollMethodType.BestOfTwo) }
                },
                {
                    text: 'roll-disadvantage',
                    icon: <Icon icon='disadvantage'/>,
                    action: () => { roll(RollMethodType.WorstOfTwo) }
                }
            ], { x: e.pageX, y: e.pageY }, true)
    }

    const handleClick: React.MouseEventHandler<HTMLSpanElement> = (e) => {
        e.preventDefault()
        e.stopPropagation()
        roll(mode)
    }

    const content = (
        <span
            className={styles.roll}
            onClick={handleClick}
            onContextMenu={handleContext}>
            {text}
            {children != null && <span>{children}</span> }
        </span>
    )

    return tooltips === null
        ? content
        : <Tooltip title={tooltips}>
            { content }
        </Tooltip>
}

export const element = {
    'roll': new RollElement(({ key, ...props }) => <RollComponent key={key} {...props}/>)
}

export default RollComponent

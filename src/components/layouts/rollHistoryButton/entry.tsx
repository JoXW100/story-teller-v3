import { useMemo } from 'react'
import type { IRollEvent } from 'components/contexts/story'
import LocalizedText from 'components/localizedText'
import { D20RollTypes, RollMethodType, isCritical, isFail, type IRollContext } from 'structure/dice'
import styles from './style.module.scss'

export type HistoryRollEntryProps = React.PropsWithRef<{
    event: IRollEvent
}>

const HistoryRollEntry = ({ event }: HistoryRollEntryProps): JSX.Element => {
    const Content = useMemo(() => {
        const context = event.context
        const selected = context.result.rolls[context.result.selected]
        const modText = selected.modifier === 0 || selected.rolls.length === 0
            ? null
            : selected.modifier < 0
                ? `${selected.sum - selected.modifier} - ${-selected.modifier} ⟶`
                : `${selected.sum - selected.modifier} + ${selected.modifier} ⟶`

        return selected.rolls.length === 0
            ? <div className={styles.entryTotal}>
                <b>{context.description}: </b>
                <b>{selected.sum}</b>
            </div>
            : <>
                <div className={styles.entryHeader}>
                    <b>{context.description}: </b>
                    <HistoryRollMethodNotice context={context}/>
                </div>
                <div className={styles.entryContent}>
                    { context.result.rolls.map((roll, index) => (
                        <div key={index} data={String(context.result.selected === index || context.method === RollMethodType.SumOfTwo || context.method === RollMethodType.BestOfThree)}>
                            {`${roll.dice.stringify()} ⟶ ${roll.rolls.map(x => x.value).join(', ')}`}
                            <HistoryRollResultNotice context={context} index={index}/>
                        </div>
                    ))}
                </div>
                <div className={styles.entryTotal}>
                    <LocalizedText className='font-bold' id='rollHistory-entry-roll'/>
                    { modText !== null && <span>{modText}</span> }
                    <b>{selected.sum}</b>
                    <HistoryRollResultNotice context={context} index={context.result.selected}/>
                </div>
            </>
    }, [event])

    return (
        <div className={styles.entry}>
            { Content }
        </div>
    )
}

type HistoryRollMethodNoticeProps = React.PropsWithRef<{
    context: IRollContext
}>

const HistoryRollMethodNotice: React.FC<HistoryRollMethodNoticeProps> = ({ context }) => {
    if (context.method === RollMethodType.SumOfTwo) {
        return <b data='crit'>+CRIT</b>
    }

    if (context.method === RollMethodType.BestOfTwo) {
        return <b data='adv'>+ADV</b>
    }

    if (context.method === RollMethodType.WorstOfTwo) {
        return <b data='dis'>-DIS</b>
    }

    return null
}

type HistoryRollResultNoticeProps = React.PropsWithRef<{
    context: IRollContext
    index: number
}>

const HistoryRollResultNotice: React.FC<HistoryRollResultNoticeProps> = ({ context, index }) => {
    if (!D20RollTypes.has(context.type)) {
        return null
    }

    const result = context.result.rolls[index]
    if (isFail(result)) {
        return <b data='fail'>-FAIL</b>
    }

    if (isCritical(result)) {
        return <b data='crit'>+CRIT</b>
    }

    return null
}

export default HistoryRollEntry

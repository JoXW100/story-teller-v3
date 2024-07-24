import { useContext, useEffect, useState } from 'react'
import { Context } from 'components/contexts/story'
import HistoryRollEntry from './entry'
import { asBooleanString } from 'utils'
import styles from './style.module.scss'

type RollHistoryPanelProps = React.PropsWithRef<{
    open: () => void
    close: () => void
    isOpen: boolean
}>

interface RollHistoryPanelState {
    active: boolean
    interrupt: NodeJS.Timeout | null
}

const duration = 10 * 1000 // 20 sec
const interval = 200 // 200 ms

const RollHistoryPanel: React.FC<RollHistoryPanelProps> = ({ open, close, isOpen }) => {
    const [context] = useContext(Context)
    const [state, setState] = useState<RollHistoryPanelState>({
        active: false,
        interrupt: null
    })

    useEffect(() => {
        const res = context.rollHistory.some(x => x !== null && Date.now() - x.time < duration)
        let interrupt: RollHistoryPanelState['interrupt'] = null

        if (res) {
            interrupt = setInterval(() => {
                const res = context.rollHistory.some(x => x !== null && Date.now() - x.time < duration)
                setState((state) => ({ ...state, active: res }))
            }, interval)
        }

        setState((state) => {
            if (state.interrupt !== null) {
                clearInterval(state.interrupt)
            }
            return { ...state, active: res, interrupt: interrupt }
        })
    }, [context.rollHistory])

    useEffect(() => {
        if (state.active) {
            open()
        } else {
            setState((state) => {
                if (state.interrupt !== null) {
                    clearInterval(state.interrupt)
                    return { ...state, interrupt: null }
                }
                return state
            })
            close()
        }
    }, [close, open, state.active])

    const date = Date.now()
    const display = isOpen || context.rollHistory.some((x) => x !== null && date - x.time < duration)

    return (
        <div className={styles.main} data={asBooleanString(display)}>
            { display && context.rollHistory
                .reduceRight<React.ReactNode[]>((prev, event, index) => {
                if (event !== null && (isOpen || date - event.time < duration)) {
                    return [...prev, <HistoryRollEntry key={index} event={event}/>]
                }
                return prev
            }, [])
            }
        </div>
    )
}

export default RollHistoryPanel

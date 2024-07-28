import { useContext, useState } from 'react'
import { Context } from 'components/contexts/file'
import Elements from 'components/elements'
import LocalizedText from 'components/controls/localizedText'
import { asNumber } from 'utils'
import Beyond20 from 'utils/beyond20'
import type CreatureFacade from 'structure/database/files/creature/facade'
import { RollMethodType, RollType } from 'structure/dice'
import styles from '../styles.module.scss'

type HealthBoxProps = React.PropsWithRef<{
    facade: CreatureFacade
}>

interface HealthBoxState {
    healDamageInput: string
    hpInput: string | null
    tempInput: string | null
}

const HealthBox: React.FC<HealthBoxProps> = ({ facade }) => {
    const [, dispatch] = useContext(Context)
    const [state, setState] = useState<HealthBoxState>({
        healDamageInput: '',
        hpInput: null,
        tempInput: null
    })

    const handleChangeHealthInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setState((state) => ({ ...state, healDamageInput: e.target.value }))
    }

    const changeHealth = (value: number): void => {
        const max = facade.healthValue
        let health = asNumber(facade.storage.health, max)
        let temp = asNumber(facade.storage.healthTemp, 0)
        if (value < 0) {
            const rest = value + temp
            if (rest < 0) {
                health = Math.max(health + rest, 0)
                dispatch.setStorage('health', health)
            }
            temp = Math.max(rest, 0)
            if (temp === 0) {
                dispatch.setStorage('healthTemp', null)
            } else {
                dispatch.setStorage('healthTemp', temp)
            }
        } else {
            health = Math.min(health + value, max)
            if (health === max) {
                dispatch.setStorage('health', null)
            } else {
                dispatch.setStorage('health', health)
            }
        }
        Beyond20.sendHealthUpdate(facade.name, health, max, temp)
    }

    const handleHealClick = (): void => {
        const value = parseInt(state.healDamageInput)
        if (!isNaN(value)) {
            changeHealth(value)
        }
        setState({ ...state, healDamageInput: '' })
    }

    const handleDamageClick = (): void => {
        const value = parseInt(state.healDamageInput)
        if (!isNaN(value)) {
            changeHealth(-value)
        }
        setState({ ...state, healDamageInput: '' })
    }

    const handleHPClick = (): void => {
        setState({ ...state, hpInput: String(asNumber(facade.storage.health, facade.healthValue)) })
    }

    const handleHPChanged: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setState({ ...state, hpInput: e.target.value })
    }

    const handleHPFocusLost: React.FocusEventHandler<HTMLInputElement> = (e) => {
        const number = parseInt(e.target.value)
        if (!isNaN(number)) {
            dispatch.setStorage('health', Math.min(Math.max(number, 0), facade.healthValue))
        }
        setState({ ...state, hpInput: null })
    }

    const handleTempClick = (): void => {
        setState({ ...state, tempInput: String(asNumber(facade.storage.healthTemp, 0)) })
    }

    const handleTempChanged: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setState({ ...state, tempInput: e.target.value })
    }

    const handleTempFocusLost: React.FocusEventHandler<HTMLInputElement> = (e) => {
        const number = parseInt(e.target.value)
        if (!isNaN(number)) {
            dispatch.setStorage('healthTemp', Math.max(number, 0))
        }
        setState({ ...state, tempInput: null })
    }

    return (
        <Elements.align direction='h' weight='1' width='100%'>
            <div className={styles.armorBox}>
                <b>AC</b>
                <b>{facade.acValue}</b>
            </div>
            <div className={styles.initiativeBox}>
                <b>Initiative</b>
                <Elements.roll
                    dice={String(facade.initiativeValue)}
                    desc='Initiative'
                    details={null}
                    tooltips={null}
                    critRange={facade.critRange}
                    critDieCount={facade.critDieCount}
                    mode={RollMethodType.Normal}
                    type={RollType.Initiative}/>
            </div>
            <div className={styles.healthBox}>
                <div>
                    <button
                        disabled={state.healDamageInput.length === 0}
                        onClick={handleHealClick}>
                        <LocalizedText id='render-heal'/>
                    </button>
                    <input
                        value={state.healDamageInput}
                        type='number'
                        onChange={handleChangeHealthInput}/>
                    <button
                        disabled={state.healDamageInput.length === 0}
                        onClick={handleDamageClick}>
                        <LocalizedText id='render-damage'/>
                    </button>
                </div>
                <div>
                    <b>HP</b>
                    <span/>
                    <b>MAX</b>
                    <b>TEMP</b>
                    { state.hpInput === null
                        ? <span onClick={handleHPClick}>{asNumber(facade.storage.health, facade.healthValue)}</span>
                        : <input type='number' autoFocus onChange={handleHPChanged} onBlur={handleHPFocusLost} value={state.hpInput}/>
                    }
                    <b>/</b>
                    <span>{`${facade.healthValue} `}</span>
                    { state.tempInput === null
                        ? <span onClick={handleTempClick}>{asNumber(facade.storage.healthTemp, -1) < 0 ? '-' : asNumber(facade.storage.healthTemp)}</span>
                        : <input type='number' autoFocus onChange={handleTempChanged} onBlur={handleTempFocusLost} value={state.tempInput}/>
                    }

                    <b>Hit Points</b>
                </div>
            </div>
        </Elements.align>
    )
}

export default HealthBox

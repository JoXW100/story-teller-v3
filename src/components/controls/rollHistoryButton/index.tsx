import React, { useState, useContext, useCallback } from 'react'
import HistoryIcon from '@mui/icons-material/HistorySharp'
import { Tooltip } from '@mui/material'
import RollHistoryPanel from './panel'
import { isDefined } from 'utils'
import { Context } from 'components/contexts/roll'
import LocalizedText from 'components/controls/localizedText'
import styles from './style.module.scss'

type RollHistoryButtonProps = React.PropsWithRef<{
    disabled?: boolean
}>

const RollHistoryButton: React.FC<RollHistoryButtonProps> = ({ disabled = false }) => {
    const [context, dispatch] = useContext(Context)
    const [open, setOpen] = useState(false)
    const [toggled, setToggled] = useState(false)

    const handleClick = (): void => {
        setToggled((toggled) => {
            dispatch.clearRollHistory()
            return !toggled
        })
    }

    const handleOpen = useCallback((): void => {
        setOpen(true)
    }, [])

    const handleClose = useCallback((): void => {
        setOpen(false)
    }, [])

    disabled ||= !context.rollHistory.some(isDefined)
    const tooltip = toggled
        ? 'rollHistory-button-close-tooltips'
        : 'rollHistory-button-open-tooltips'

    return (
        <div
            data={String(toggled || open)}
            className={styles.holder}>
            <Tooltip className='square' title={<LocalizedText id={tooltip}/>}>
                <div className='center-flex fill-height'>
                    <button
                        className='center-flex fill square'
                        disabled={disabled}
                        onClick={handleClick}>
                        <HistoryIcon/>
                    </button>
                </div>
            </Tooltip>
            <RollHistoryPanel
                open={handleOpen}
                close={handleClose}
                isOpen={toggled}/>
        </div>
    )
}

export default RollHistoryButton

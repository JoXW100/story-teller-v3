import React, { useState } from 'react'
import { Tooltip } from '@mui/material'
import Icon from '../icon'
import DicePanel from '.'
import styles from './style.module.scss'
import LocalizedText from '../localizedText'

const DieButton: React.FC = () => {
    const [open, setOpen] = useState(false)

    return (
        <div className={styles.buttonHolder}>
            <Tooltip title={<LocalizedText id={open ? 'dicePanel-close' : 'dicePanel-open'}/>}>
                <div className='center-flex fill-height'>
                    <button className='center-flex fill square' onClick={() => { setOpen(!open) }}>
                        <Icon icon='d20'/>
                    </button>
                </div>
            </Tooltip>
            <DicePanel open={open}/>
        </div>
    )
}

export default DieButton

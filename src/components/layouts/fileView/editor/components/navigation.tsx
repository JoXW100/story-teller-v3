import React, { useContext } from 'react'
import { Tooltip } from '@mui/material'
import BackIcon from '@mui/icons-material/ChevronLeftSharp'
import { Context } from 'components/contexts/file'
import LocalizedText from 'components/localizedText'
import styles from '../style.module.scss'

const NavigationComponent = (): JSX.Element => {
    const [context, dispatch] = useContext(Context)
    const page = context.editorPages.map(page => page.name).join(' -> ')

    const handleClick = (): void => {
        dispatch.popEditorPage()
    }

    return (
        <div className={styles.navigation}>
            <label>{page ?? 'Missing page name'}</label>
            <Tooltip title={<LocalizedText id='button-back'/>}>
                <button
                    className={styles.navigationButton}
                    onClick={handleClick}>
                    <BackIcon/>
                </button>
            </Tooltip>
        </div>
    )
}
export default NavigationComponent

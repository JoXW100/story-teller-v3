import { useContext } from 'react'
import { useRouter } from 'next/router'
import AppBar from 'components/controls/appBar'
import LocalizedText from 'components/controls/localizedText'
import DropdownMenu from 'components/controls/dropdownMenu'
import { Context } from 'components/contexts/app'
import Checkbox from 'components/controls/checkbox'
import Icon from 'components/controls/icon'
import { type LanguageType, TextData } from 'assets'
import type { IconType } from 'assets/icons'
import { keysOf } from 'utils'
import Navigation from 'utils/navigation'
import { getOptionType } from 'structure/optionData'
import styles from './style.module.scss'

interface SettingsViewParams {
    returnPath?: string
}

function createLanguageOptions(): Record<LanguageType, React.ReactNode> {
    const options: Partial<Record<LanguageType, React.ReactNode>> = {}
    for (const lang of keysOf(TextData)) {
        options[lang] = (
            <span className='fill flex-row gap-5'>
                <Icon className='small-icon' icon={TextData[lang].icon as IconType}/>
                <span className='fill center-vertical-flex'>{ TextData[lang].language }</span>
            </span>
        )
    }
    return options as Record<LanguageType, React.ReactNode>
}

const SettingsView: React.FC<SettingsViewParams> = ({ returnPath }) => {
    const [context, dispatch] = useContext(Context)
    const router = useRouter()

    const handleBack = (): void => {
        void router.push(Navigation.pageURL(returnPath))
    }

    return (
        <div>
            <AppBar headerId="settings-header" iconId="settings" handleBack={handleBack}/>
            <div className={styles.container}>
                <LocalizedText className='center-vertical-flex' id='settings-language'/>
                <span>
                    <DropdownMenu
                        value={context.language}
                        values={createLanguageOptions()}
                        onChange={(value) => { dispatch.setOption('language', value) }}
                    />
                </span>

                <LocalizedText className='center-vertical-flex' id='settings-viewMode'/>
                <span>
                    <DropdownMenu
                        value={context.viewMode}
                        values={getOptionType('viewMode').options}
                        onChange={(value) => { dispatch.setOption('viewMode', value) }}
                    />
                </span>

                <LocalizedText className='center-vertical-flex' id='settings-enableColorFileByType'/>
                <span>
                    <Checkbox
                        value={context.enableColorFileByType}
                        onChange={(value) => { dispatch.setOption('enableColorFileByType', value) }}
                    />
                </span>

                <LocalizedText className='center-vertical-flex' id='settings-enableEditorWordWrap'/>
                <span>
                    <Checkbox
                        value={context.enableEditorWordWrap}
                        onChange={(value) => { dispatch.setOption('enableEditorWordWrap', value) }}
                    />
                </span>
            </div>
        </div>
    )
}

export default SettingsView

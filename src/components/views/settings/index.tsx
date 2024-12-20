import { useContext, useMemo } from 'react'
import { TextData } from 'assets'
import { useRouter } from 'next/router'
import Palettes from 'assets/palettes'
import AppBar from 'components/controls/appBar'
import LocalizedText from 'components/controls/localizedText'
import DropdownMenu from 'components/controls/dropdownMenu'
import { Context } from 'components/contexts/app'
import Checkbox from 'components/controls/checkbox'
import { keysOf } from 'utils'
import Navigation from 'utils/navigation'
import { useLocalizedEnums } from 'utils/hooks/localization'
import styles from './style.module.scss'
import NumberInput from 'components/controls/numericInput'

interface SettingsViewParams {
    returnPath?: string
}

const SettingsView: React.FC<SettingsViewParams> = ({ returnPath }) => {
    const [context, dispatch] = useContext(Context)
    const router = useRouter()
    const viewModeOptions = useLocalizedEnums('viewMode')
    const paletteOptions = useMemo(() => {
        const result: Partial<Record<keyof typeof Palettes, string>> = {}
        for (const key of keysOf(Palettes)) {
            result[key] = context.localization.values[`palette-${key}`]
        }
        return result
    }, [context.localization.values])
    const languageOptions = useMemo(() => {
        const result: Partial<Record<keyof typeof TextData, React.ReactNode>> = {}
        for (const lang of keysOf(TextData)) {
            result[lang] = TextData[lang].language
        }
        return result
    }, [])

    const handleBack = (): void => {
        void router.push(Navigation.pageURL(returnPath))
    }

    return (
        <div>
            <AppBar headerId="settings-header" iconId="settings" handleBack={handleBack}/>
            <div className={styles.container}>
                <LocalizedText className='center-vertical-flex no-line-break' id='settings-language'/>
                <DropdownMenu
                    value={context.language}
                    values={languageOptions}
                    onChange={(value) => { dispatch.setOption('language', value) }}/>

                <LocalizedText className='center-vertical-flex no-line-break' id='settings-viewMode'/>
                <DropdownMenu
                    value={context.viewMode}
                    values={viewModeOptions}
                    onChange={(value) => { dispatch.setOption('viewMode', value) }}/>

                <LocalizedText className='center-vertical-flex no-line-break' id='settings-palette'/>
                <DropdownMenu
                    value={context.palette}
                    values={paletteOptions}
                    onChange={(value) => { dispatch.setOption('palette', value) }}/>

                <LocalizedText className='center-vertical-flex no-line-break' id='settings-enableColorFileByType'/>
                <span>
                    <Checkbox
                        value={context.enableColorFileByType}
                        onChange={(value) => { dispatch.setOption('enableColorFileByType', value) }}/>
                </span>

                <LocalizedText className='center-vertical-flex no-line-break' id='settings-editorWordWrap'/>
                <span>
                    <Checkbox
                        value={context.editorWordWrap}
                        onChange={(value) => { dispatch.setOption('editorWordWrap', value) }}/>
                </span>

                <LocalizedText className='center-vertical-flex no-line-break' id='settings-editorLineNumbers'/>
                <span>
                    <Checkbox
                        value={context.editorLineNumbers}
                        onChange={(value) => { dispatch.setOption('editorLineNumbers', value) }}/>
                </span>

                <LocalizedText className='center-vertical-flex no-line-break' id='settings-editorFontSize'/>
                <span>
                    <NumberInput
                        value={context.editorFontSize}
                        className='center-vertical-flex fill'
                        onChange={(value) => { dispatch.setOption('editorFontSize', Math.min(Math.max(value, 4), 42)) }}/>
                </span>

                <LocalizedText className='center-vertical-flex no-line-break' id='settings-hideRolls'/>
                <span>
                    <Checkbox
                        value={context.hideRolls}
                        onChange={(value) => { dispatch.setOption('hideRolls', value) }}/>
                </span>
            </div>
        </div>
    )
}

export default SettingsView

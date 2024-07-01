import Link from 'next/link'
import Tooltip from '@mui/material/Tooltip'
import Icon from 'components/icon'
import LocalizedText from 'components/localizedText'
import Navigation from 'utils/navigation'

const SettingsButton: React.FC = () => {
    return (
        <Tooltip title={<LocalizedText className='no-line-break' id='button-settings'/>}>
            <Link href={Navigation.settingsURL(location.pathname)}>
                <button className='center-flex fill-height square'>
                    <Icon icon='settings'/>
                </button>
            </Link>
        </Tooltip>
    )
}

export default SettingsButton

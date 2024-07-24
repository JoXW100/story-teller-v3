import SettingsView from 'components/views/settings'

interface SettingsPageProps {
    props: {
        returnPath?: string
    }
}

const SettingsPage: React.FC<SettingsPageProps> = ({ props }) => {
    return (
        <SettingsView returnPath={props.returnPath}/>
    )
}

export default SettingsPage

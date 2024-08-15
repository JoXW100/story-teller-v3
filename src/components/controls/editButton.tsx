import { useContext } from 'react'
import Link from 'next/link'
import Tooltip from '@mui/material/Tooltip'
import Icon from 'components/controls/icon'
import LocalizedText from 'components/controls/localizedText'
import { Context } from 'components/contexts/story'
import Navigation from 'utils/navigation'

const EditButton: React.FC = () => {
    const [context] = useContext(Context)
    return (
        <Tooltip title={<LocalizedText className='no-line-break' id='button-edit'/>}>
            <Link href={Navigation.editURL(!context.editEnabled)}>
                <button className='center-flex fill-height square'>
                    <Icon icon='edit'/>
                </button>
            </Link>
        </Tooltip>
    )
}

export default EditButton

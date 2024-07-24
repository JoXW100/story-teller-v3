import { useContext } from 'react'
import { Tooltip } from '@mui/material'
import EditIcon from '@mui/icons-material/EditSharp'
import LocalizedText from 'components/controls/localizedText'
import { Context, type IEditorPageData } from 'components/contexts/file'

const EditItemButtonComponent: React.FC<IEditorPageData> = ({ pageKey, root, name }) => {
    const [, dispatch] = useContext(Context)

    const handleClick = (): void => {
        dispatch.pushEditorPage({
            pageKey: pageKey,
            root: root,
            name: name
        })
    }

    return (
        <Tooltip title={<LocalizedText id='common-edit'/>}>
            <button className='center-flex fill-height square' onClick={handleClick}>
                <EditIcon className='small-icon'/>
            </button>
        </Tooltip>
    )
}

export default EditItemButtonComponent

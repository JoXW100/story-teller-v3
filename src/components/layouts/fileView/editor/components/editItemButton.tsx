import { useContext } from 'react'
import { Tooltip } from '@mui/material'
import EditIcon from '@mui/icons-material/EditSharp'
import LocalizedText from 'components/localizedText'
import { Context, type IEditorPageData } from 'components/contexts/file'

const EditItemButtonComponent: React.FC<IEditorPageData> = ({ pageKey, root, name, deps }) => {
    const [, dispatch] = useContext(Context)

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = () => {
        dispatch.pushEditorPage({
            pageKey: pageKey,
            root: root,
            name: name,
            deps: deps
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

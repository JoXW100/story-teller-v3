import { useContext } from 'react'
import CloseIcon from '@mui/icons-material/CloseSharp'
import FolderIcon from '@mui/icons-material/FolderSharp'
import { Tooltip } from '@mui/material'
import { Context } from './context'
import type { LanguageKey } from 'assets'
import IconMap from 'assets/icons'
import { Context as AppContext } from 'components/contexts/app'
import LocalizedText from 'components/controls/localizedText'
import Icon from 'components/controls/icon'
import Checkbox from 'components/controls/checkbox'
import { asKeyOf } from 'utils'
import { DocumentType, FileType } from 'structure/database'
import styles from './style.module.scss'

const FileFilterMenu: React.FC = () => {
    const [app] = useContext(AppContext)
    const [state, dispatch] = useContext(Context)

    const handleChangeFolder = (): void => {
        dispatch.setFilter({
            ...state.filter,
            showEmptyFolders: !state.filter.showEmptyFolders
        })
    }

    const handleChange = (type: Exclude<DocumentType, 'search'>): void => {
        dispatch.setFilter({
            ...state.filter,
            [type]: !state.filter[type]
        })
    }

    return (
        <div className={styles.fileFilterMenu}>
            <div className={styles.fileFilterMenuHeader}>
                <LocalizedText id='filter-menu-header'/>
                <Tooltip title={<LocalizedText id='common-close'/>}>
                    <button
                        className={styles.headerEndButton}
                        onClick={dispatch.closeFilterMenu}>
                        <CloseIcon className='small-icon'/>
                    </button>
                </Tooltip>
            </div>
            <div className={styles.fileFilterMenuItem}
                data={app.enableColorFileByType ? FileType.Folder : undefined}>
                <Checkbox
                    value={state.filter.showEmptyFolders}
                    onChange={handleChangeFolder}/>
                <FolderIcon/>
                <LocalizedText id='filter-menu-showEmptyFolders'/>
            </div>
            { Object.values(DocumentType).map((type) =>
                <div
                    className={styles.fileFilterMenuItem}
                    key={type}
                    data={app.enableColorFileByType ? type : undefined}>
                    <Checkbox
                        value={state.filter[type]}
                        onChange={() => { handleChange(type) }}/>
                    <Icon className='small-icon' icon={asKeyOf(type, IconMap) ?? 'txt'}/>
                    <LocalizedText id={`document-${type}` as LanguageKey}/>
                </div>
            )}
        </div>
    )
}

export default FileFilterMenu

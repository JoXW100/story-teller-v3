import { Fragment, useContext } from 'react'
import CloseIcon from '@mui/icons-material/CloseSharp'
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
                        <CloseIcon className='square small-icon'/>
                    </button>
                </Tooltip>
            </div>
            <div className={styles.fileFilterMenuContent}>
                <Checkbox
                    value={state.filter.showEmptyFolders}
                    onChange={handleChangeFolder}/>
                <Icon className='square small-icon color-by-type' data={app.enableColorFileByType ? FileType.Folder : undefined} icon='folder'/>
                <LocalizedText className='no-line-break' id='filter-menu-showEmptyFolders'/>
                { Object.values(DocumentType).map((type) =>
                    <Fragment key={type}>
                        <Checkbox
                            value={state.filter[type]}
                            onChange={() => { handleChange(type) }}/>
                        <Icon className='square small-icon color-by-type' data={app.enableColorFileByType ? type : undefined} icon={asKeyOf(type, IconMap) ?? 'txt'}/>
                        <LocalizedText className='no-line-break' id={`document-${type}` as LanguageKey}/>
                    </Fragment>
                )}
            </div>
        </div>
    )
}

export default FileFilterMenu

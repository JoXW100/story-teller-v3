import React, { useContext } from 'react'
import FilterCloseIcon from '@mui/icons-material/FilterAltOffSharp'
import FilterOpenIcon from '@mui/icons-material/FilterAltSharp'
import CollapseIcon from '@mui/icons-material/ChevronLeftSharp'
import { Tooltip } from '@mui/material'
import SearchBar from '../searchBar'
import LocalizedText from 'components/localizedText'
import { Context } from 'components/layouts/fileSystem/context'
import { Context as StoryContext } from 'components/contexts/story'
import styles from './style.module.scss'
import { InputTypeDataMap } from '../../dialogs/createFile'
import { keysOf } from 'utils'

const FileMenuHeader: React.FC = () => {
    const [state, dispatch] = useContext(Context)
    const [, storyDispatch] = useContext(StoryContext)

    const handleSearchChanged = (value: string): void => {
        dispatch.setFilter({ ...state.filter, search: value })
    }

    return (
        <div className={styles.header}>
            <div className='flex'>
                { keysOf(InputTypeDataMap).map((type) => (
                    <Tooltip key={String(type)} title={<LocalizedText className='no-line-break' id={InputTypeDataMap[type].text}/>}>
                        <button
                            className={styles.headerButton}
                            onClick={() => { dispatch.openCreateFileMenu(type) }}>
                            { InputTypeDataMap[type].icon }
                        </button>
                    </Tooltip>
                ))}
                <Tooltip title={<LocalizedText className='no-line-break' id='common-collapse'/>}>
                    <button
                        className={styles.headerEndButton}
                        onClick={storyDispatch.collapseSidePanel}>
                        <CollapseIcon/>
                    </button>
                </Tooltip>
            </div>
            <div className={styles.headerFilterRow}>
                <SearchBar
                    className='fill-height'
                    value={state.filter.search}
                    onChange={handleSearchChanged}/>
                { state.showFilterMenu
                    ? <Tooltip title={<LocalizedText className='no-line-break' id='fileSystem-filter-menu-close'/>}>
                        <button
                            className={styles.headerEndButton}
                            onClick={dispatch.closeFilterMenu}>
                            <FilterCloseIcon/>
                        </button>
                    </Tooltip>
                    : <Tooltip title={<LocalizedText className='no-line-break' id='fileSystem-filter-menu-open'/>}>
                        <button
                            className={styles.headerEndButton}
                            onClick={dispatch.openFilterMenu}>
                            <FilterOpenIcon/>
                        </button>
                    </Tooltip>
                }
            </div>
        </div>
    )
}

export default FileMenuHeader

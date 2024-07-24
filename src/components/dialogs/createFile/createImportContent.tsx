import { useEffect, useRef, useState } from 'react'
import OpenExternalIcon from '@mui/icons-material/OpenInNewSharp'
import NextIcon from '@mui/icons-material/NavigateNextSharp'
import PrevIcon from '@mui/icons-material/NavigateBeforeSharp'
import { Tooltip } from '@mui/material'
import LocalizedText from 'components/controls/localizedText'
import SearchBar from 'components/controls/searchBar'
import Loading from 'components/controls/loading'
import type { CreateContentProps } from '.'
import { Open5eCompendiumData } from 'assets'
import { asNumber } from 'utils'
import { useLocalizedText } from 'utils/hooks/localizedText'
import Navigation from 'utils/navigation'
import Communication from 'utils/communication'
import Logger from 'utils/logger'
import { open5eCreatureImporter, open5eSpellImporter } from 'utils/importers/open5eImporter'
import { DocumentType } from 'structure/database'
import type { IOpen5eItemInfo, ICompendiumMenuItem } from 'types/open5eCompendium'
import styles from './style.module.scss'
import SpellDataFactory from 'structure/database/files/spell/factory'
import CreatureDataFactory from 'structure/database/files/creature/factory'

interface ImportContentState {
    menu: ICompendiumMenuItem
    values: IOpen5eItemInfo[]
    sorting: SortingMethod
    selected: IOpen5eItemInfo | null
    loading: boolean
    page: number
}

interface SortingMethod {
    field: string | null
    direction: 'ascending' | 'descending' | 'none'
}

const spellFilterItems = ['C', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const hpSplitExpr = /^([0-9]+)d([0-9]+) *([\+\-][0-9]+)?/
const castingTimeSplitExpr = /^([0-9]+) *([a-z]+)/i
const itemsPerPage = 100

const splitHP = (hp?: string): { num: number, dice: number, mod: number } => {
    const res = hpSplitExpr.exec(hp ?? '') ?? []
    return {
        num: asNumber(res[1], 0),
        dice: asNumber(res[2], 0),
        mod: asNumber(res[3], 0)
    }
}

const splitCastingTime = (castingTime?: string): { num: number, type: string } => {
    const res = castingTimeSplitExpr.exec(castingTime ?? '') ?? []
    return {
        num: asNumber(res[1], 0),
        type: res[2] ?? ''
    }
}

const CreateImportContent: React.FC<CreateContentProps> = ({ callback, close }) => {
    const ref = useRef<HTMLButtonElement>(null)
    const placeholder = useLocalizedText('dialog-createFile-fileNamePlaceholder')
    const [name, setName] = useState('')
    const [searchText, setSearchText] = useState('')
    const [spellFilter, setSpellFilter] = useState(Array.from({ length: 10 }, () => true))
    const [state, setState] = useState<ImportContentState>({
        menu: Open5eCompendiumData[0],
        values: [],
        sorting: { field: null, direction: 'none' },
        selected: null,
        loading: false,
        page: 0
    })

    useEffect(() => {
        setState((state) => {
            if (state.loading) {
                return state
            }
            Communication.open5eFetchAll<IOpen5eItemInfo>(state.menu.type, state.menu.query, ['slug', 'level_int', ...state.menu.fields])
                .then((res) => {
                    setState((state) => ({ ...state, loading: false, values: res.results }))
                }, (e: unknown) => {
                    Logger.throw('CreateImportContent.open5eFetchAll', e)
                    setState((state) => ({ ...state, loading: false, values: [] }))
                })
            return { ...state, loading: true, page: 0, values: [] }
        })
    }, [state.menu])

    const handleImportClick = (): void => {
        if (state.selected != null) {
            if (state.menu.type === 'monsters') {
                open5eCreatureImporter(state.selected.slug)
                    .then((res) => {
                        if (res === null) {
                            return
                        }

                        callback?.({
                            type: DocumentType.Creature,
                            name: name,
                            data: CreatureDataFactory.simplify(res)
                        })
                    }, (e: unknown) => {
                        Logger.throw('createImportContent.open5eCreatureImporter', e)
                    }).finally(close)
            } else {
                open5eSpellImporter(state.selected.slug)
                    .then((res) => {
                        if (res === null) {
                            return
                        }

                        callback?.({
                            type: DocumentType.Spell,
                            name: name,
                            data: SpellDataFactory.simplify(res)
                        })
                    }, (e: unknown) => {
                        Logger.throw('createImportContent.open5eSpellImporter', e)
                    }).finally(close)
            }
        }
    }

    const handleItemCLick = (item: IOpen5eItemInfo): void => {
        if (name.length === 0) {
            setName(item.name)
        }
        setState((state) => ({ ...state, selected: item }))
    }

    const handleMenuItemCLick = (item: ICompendiumMenuItem): void => {
        setState((state) => ({ ...state, menu: item, selected: null }))
    }

    const handleSpellFilterItemCLick = (index: number): void => {
        const filter = [...spellFilter]
        filter[index] = !filter[index]
        setSpellFilter(filter)
        setState((state) => state.page === 0 ? state : { ...state, page: 0 })
    }

    const handleNavigateClick = (e: React.MouseEvent, item: IOpen5eItemInfo): void => {
        e.stopPropagation()
        window.open(Navigation.open5eURL(state.menu.type, item.slug))
    }

    const handleSearchChange = (newValue: string): void => {
        setState(state => state.page === 0 ? state : { ...state, page: 0 })
        setSearchText(newValue)
    }

    const filterItems = (items: IOpen5eItemInfo[]): IOpen5eItemInfo[] => {
        let res = items.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()))
        if (state.menu.type === 'spells') {
            res = res.filter((item) => item.level_int !== undefined && spellFilter[item.level_int])
        }
        return res
    }

    const sortItems = (a: IOpen5eItemInfo, b: IOpen5eItemInfo): number => {
        let val = 0
        if (state.sorting.field !== null && typeof a[state.sorting.field] === typeof '') {
            const numA = Number(a[state.sorting.field])
            if (!isNaN(numA)) {
                const numB = parseInt(b[state.sorting.field])
                val = numA - numB
            } else if (hpSplitExpr.test(a[state.sorting.field])) {
                const hpA = splitHP(a[state.sorting.field])
                const hpB = splitHP(b[state.sorting.field])
                val = ((hpA.num * (hpA.dice + 1) / 2) + hpA.mod) - ((hpB.num * (hpB.dice + 1) / 2 + hpB.mod))
            } else if (castingTimeSplitExpr.test(a[state.sorting.field])) {
                const timeA = splitCastingTime(a[state.sorting.field])
                const timeB = splitCastingTime(b[state.sorting.field])
                val = timeA.type.localeCompare(timeB.type)
                if (val === 0) {
                    val = timeA.num - timeB.num
                }
            } else {
                val = String(a[state.sorting.field]).localeCompare(b[state.sorting.field])
            }
        } else if (state.sorting.field !== null) {
            val = Number(a[state.sorting.field]) - b[state.sorting.field]
        }
        return state.sorting.direction === 'descending' ? val : -val
    }

    const getPageItems = (items: IOpen5eItemInfo[]): IOpen5eItemInfo[] => {
        return items.slice(state.page * itemsPerPage, (state.page + 1) * itemsPerPage)
    }

    const buildMenuItems = (items: ICompendiumMenuItem[], level: number = 0): JSX.Element[] => {
        return items.map((item, index) => {
            const selected = state.menu?.title === item.title
            const buttonComponent = (
                <button
                    key={`${level}-${index}`}
                    className={styles.inputCompendiumMenuItem}
                    value={String(level)}
                    data={selected ? 'selected' : undefined }
                    disabled={state.loading || selected}
                    onClick={() => { handleMenuItemCLick(item) } }>
                    { item.title }
                </button>
            )
            return (
                (item.subItems?.length ?? 0) > 0
                    ? <div
                        key={`${level}-${index}-holder`}
                        className={styles.inputCompendiumMenuItemHolder}>
                        { buttonComponent }
                        { buildMenuItems(item.subItems ?? [], level + 1) }
                    </div>
                    : buttonComponent
            )
        })
    }

    const handleHeaderFieldClick = (index: number): void => {
        if (state.menu.sortFields?.[index] === undefined) {
            return
        }

        const sorting: SortingMethod = {
            field: state.menu.sortFields[index],
            direction: 'descending'
        }

        if (state.sorting.field === state.menu.sortFields[index]) {
            switch (state.sorting.direction) {
                case 'ascending':
                    sorting.direction = 'none'
                    break
                case 'descending':
                    sorting.direction = 'ascending'
                    break
                case 'none':
                    sorting.direction = 'descending'
                    break
                default:
                    break
            }
        }

        setState({ ...state, sorting: sorting, page: 0 })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setName(e.target.value)
    }

    const handleInput = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter' && ref.current?.disabled !== true) {
            ref.current?.click()
            close()
        }
    }

    const filteredItems = state.loading ? [] : filterItems(state.values)
    const items = state.sorting.direction !== 'none'
        ? filteredItems.sort(sortItems)
        : filteredItems
    const numPages = Math.ceil(items.length / itemsPerPage)

    const handlePaginator = (delta: number): void => {
        setState(state => ({ ...state, page: Math.max(0, Math.min(state.page + delta, numPages - 1)) }))
    }

    return (
        <>
            <div className={styles.inputCompendiumArea}>
                <div className={styles.inputHeader}>
                    <b><LocalizedText id='dialog-createFile-importHeader'/></b>
                    <div className={styles.compendiumSpellFilterGroup}>
                        { state.menu.type === 'spells' && spellFilterItems.map((item, index) => (
                            <button
                                key={index}
                                className={styles.compendiumSpellFilterGroupItem}
                                onClick={() => { handleSpellFilterItemCLick(index) }}
                                data={spellFilter[index] ? 'selected' : undefined}>
                                { item }
                            </button>
                        ))}
                    </div>
                    <SearchBar value={searchText} onChange={handleSearchChange}/>
                </div>
                <div className={styles.inputCompendium}>
                    <div className={styles.inputCompendiumMenu}>
                        { buildMenuItems(Open5eCompendiumData) }
                    </div>
                    <div className={styles.inputCompendiumValueTable}>
                        <Loading loaded={!state.loading}>
                            <table>
                                <thead>
                                    <tr className={styles.inputCompendiumListHeader}>
                                        { state.menu.headers?.map((header, index) => (
                                            <th
                                                key={index}
                                                onClick={() => { handleHeaderFieldClick(index) }}
                                                data={state.menu.sortFields.length > 0 && state.sorting.field === state.menu.sortFields[index]
                                                    ? state.sorting.direction
                                                    : undefined}>
                                                { header }
                                            </th>
                                        ))}
                                        <th/>
                                    </tr>
                                </thead>
                                <tbody>
                                    { getPageItems(items).map((item) => (
                                        <tr
                                            key={item.slug}
                                            className={styles.inputCompendiumItem}
                                            onClick={() => { handleItemCLick(item) }}
                                            data={state.selected?.slug === item.slug ? 'selected' : undefined }>
                                            { state.menu.fields.map((field) => (
                                                <td key={field}>{item[field]}</td>
                                            ))}
                                            <Tooltip placement='left' title={<LocalizedText id='dialog-createFile-openExternal' args={[item.name]}/>}>
                                                <td onClick={(e) => { handleNavigateClick(e, item) }}>
                                                    <OpenExternalIcon/>
                                                </td>
                                            </Tooltip>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            { items.length > itemsPerPage && (
                                <div className={styles.compendiumPaginator}>
                                    <button
                                        disabled={state.page === 0}
                                        onClick={() => { handlePaginator(-1) }}>
                                        <PrevIcon/>
                                    </button>
                                    { `${state.page + 1} / ${numPages}` }
                                    <button
                                        disabled={items.length <= (state.page + 1) * itemsPerPage}
                                        onClick={() => { handlePaginator(1) }}>
                                        <NextIcon/>
                                    </button>
                                </div>
                            )}
                        </Loading>
                    </div>
                </div>
            </div>
            <div className={styles.inputRow}>
                <LocalizedText id='dialog-createFile-fileNamePrompt' className='no-line-break'/>
                <input
                    value={name}
                    onChange={handleChange}
                    onKeyDown={handleInput}
                    placeholder={placeholder}
                />
            </div>
            <div className={styles.inputRow}>
                <button
                    ref={ref}
                    onClick={handleImportClick}
                    disabled={name.length === 0 || state.selected == null}>
                    { state.selected !== null
                        ? <LocalizedText id='dialog-createFile-button-import-value' args={[state.selected.name]}/>
                        : <LocalizedText id='dialog-createFile-button-import-value-empty'/>
                    }
                </button>
            </div>
        </>
    )
}

export default CreateImportContent

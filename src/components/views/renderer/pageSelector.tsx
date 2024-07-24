import LocalizedText from 'components/controls/localizedText'
import type { LanguageKey } from 'assets'
import styles from './styles.module.scss'
import { keysOf } from 'utils'

export interface IPageSelectorData {
    key: LanguageKey
    args?: any[]
}

type PageSelectorProps<T extends Record<string, IPageSelectorData>> = React.PropsWithRef<{
    selected: keyof T | null
    pages: T
    setSelected: (page: keyof T) => void
}>

const PageSelector = <T extends Record<string, IPageSelectorData>>({ pages, selected, setSelected }: PageSelectorProps<T>): React.ReactNode => {
    return (
        <div className={styles.pageSelector}>
            { keysOf(pages).map((key) => (
                <button key={key} disabled={key === selected} onClick={() => { setSelected(key) }}>
                    <LocalizedText id={pages[key].key} args={pages[key].args}/>
                </button>
            ))}
        </div>
    )
}

export default PageSelector

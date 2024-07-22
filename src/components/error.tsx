import LocalizedText from './localizedText'
import type { LanguageKey } from 'data'

type LoadingProps = React.PropsWithChildren<{
    languageKey?: LanguageKey
    error?: string | null
}>

const Error: React.FC<LoadingProps> = ({ languageKey = 'empty', error = null, children }): React.ReactNode => {
    if (error === null) {
        return children
    } else {
        return (
            <div className='fill center-flex' >
                <LocalizedText id={languageKey} args={[error]}/>
            </div>
        )
    }
}

export default Error

import { useLocalizedText } from 'utils/hooks/localizedText'
import type { LanguageKey } from 'data'

type LocalizedTextProps = React.PropsWithRef<{
    id: LanguageKey
    className?: string
    args?: Array<string | number>
}>

const LocalizedText: React.FC<LocalizedTextProps> = ({ id, args = [], className }) => {
    const text = useLocalizedText(id, args)

    if (className === undefined) {
        return text
    }

    return (
        <span className={className}>
            {text}
        </span>
    )
}

export default LocalizedText

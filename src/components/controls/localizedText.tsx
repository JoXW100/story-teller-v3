import type { LanguageKey } from 'assets'
import { useLocalizedText } from 'utils/hooks/localization'

type LocalizedTextProps = React.PropsWithRef<{
    id: LanguageKey
    className?: string
    args?: (string | number)[]
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

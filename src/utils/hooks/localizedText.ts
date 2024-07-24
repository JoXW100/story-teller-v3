import { useContext, useMemo } from 'react'
import { Context } from 'components/contexts/app'
import Logger from 'utils/logger'
import type { LanguageKey } from 'assets'

export function useLocalizedText(id: LanguageKey | null | undefined, args: Array<string | number> = []): string | undefined {
    const [context] = useContext(Context)
    return useMemo(() => {
        if (id === null || id === undefined) {
            return undefined
        }

        let text: string = context.localization.values[id]

        if (text === undefined) {
            Logger.error('Localization.toText', 'No localization text for: ' + id, args)
            return '__MISSING__'
        }

        for (let index = 0; index < args.length; index++) {
            text = text.replace(`@${index + 1}`, String(args[index]))
        }

        return text
    }, [context.localization, id, args])
}

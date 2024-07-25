import { useCallback, useContext, useMemo } from 'react'
import type { ITextData, LanguageKey } from 'assets'
import { Context } from 'components/contexts/app'
import Logger from 'utils/logger'
import { getEnumType, type EnumTypeKey, type EnumTypeKeyValue, type EnumTypeValue } from 'structure/enums'

function translate(data: ITextData, id: LanguageKey, args: Array<string | number> = []): string {
    let text: string = data.values[id]

    if (text === undefined) {
        Logger.error('Localization.toText', 'No localization text for: ' + id, args)
        return '__MISSING__'
    }

    for (let index = 0; index < args.length; index++) {
        text = text.replace(`@${index + 1}`, String(args[index]))
    }

    return text
}

export function useLocalizedText(id: LanguageKey | null | undefined, args?: Array<string | number>): string | undefined {
    const [context] = useContext(Context)
    return useMemo(() => {
        if (id === null || id === undefined) {
            return undefined
        } else {
            return translate(context.localization, id, args)
        }
    }, [context.localization, id, args])
}

export type TranslationHandler = (id: LanguageKey, args?: Array<string | number>) => string
export function useTranslator(): TranslationHandler {
    const [context] = useContext(Context)
    return useCallback((id: LanguageKey, args: Array<string | number> = []): string => {
        return translate(context.localization, id, args)
    }, [context.localization])
}

export function useLocalizedOptions<T extends EnumTypeKey>(type?: T): Record<EnumTypeValue<T>, string> {
    const [context] = useContext(Context)
    return useMemo(() => {
        const options: Partial<Record<EnumTypeValue<T>, string>> = {}
        if (type !== undefined) {
            const optionTypes = getEnumType(type)
            for (const value of Object.values(optionTypes.enum)) {
                const localizationKey = `enum-${type}-${value}` as EnumTypeKeyValue
                options[value as EnumTypeValue<T>] = context.localization.values[localizationKey]
            }
        }
        return options as Record<EnumTypeValue<T>, string>
    }, [context.localization, type])
}

export function useLocalizedOption<T extends EnumTypeKey>(type?: T, value?: EnumTypeValue<T>): string | undefined {
    const [context] = useContext(Context)
    if (type !== undefined && value !== undefined) {
        const localizationKey = `enum-${type}-${value as EnumTypeValue}` as EnumTypeKeyValue
        return context.localization.values[localizationKey]
    }
    return undefined
}

import type { ICompendiumMenuItem } from 'types/open5eCompendium'
import Open5eCompendiumMenu from './open5eCompendiumMenu.json'
import Text from './text.json'

export type LanguageType = keyof typeof Text
export type LanguageKey = keyof typeof Text['eng']['values']

export interface ITextData {
    language: string
    icon: string
    values: Record<LanguageKey, string>
}

export const Open5eCompendiumData: ICompendiumMenuItem[] = Open5eCompendiumMenu
export const TextData: Record<LanguageType, ITextData> = Text

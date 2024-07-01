import type React from 'react'
import { Element } from '.'

export type AlignElementParams = React.PropsWithChildren<{
    direction: string
    weight: string | number
    width: string
}>

class AlignElement extends Element<AlignElementParams> {
    public static readonly Directions = new Set(['c', 'h', 'v'])
    public readonly name = 'align'
    public readonly defaultParam = 'direction'
    public readonly params = {
        'direction': {
            default: 'h',
            validate: (value) => {
                const parts = value.trim().split('')
                const found = new Set<string>()
                for (const part of parts) {
                    if (found.has(part) || !AlignElement.Directions.has(part)) {
                        return false
                    }
                    found.add(part)
                }
                return true
            },
            parse: (value) => value
        },
        'weight': {
            default: '1',
            validate: (value) => /^([0-9]*\.)?[0-9]+$/.test(value),
            parse: (value) => value
        },
        'width': {
            default: '100%',
            validate: (value) => /^([0-9]*\.)?[0-9]+(px|cm|em|in|%|)$/.test(value),
            parse: (value) => value
        }
    } satisfies Element<AlignElementParams>['params']
}

export default AlignElement

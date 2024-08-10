import type React from 'react'
import { Element } from '.'
import { isCSSValueString, isFloatString } from 'utils'

export type AlignElementParams = React.PropsWithChildren<{
    direction: string
    weight: string | number | null
    width: string | null
}>

class AlignElement extends Element<AlignElementParams> {
    public static readonly Directions = new Set(['c', 'h', 'v'])
    public readonly name = 'align'
    public readonly defaultParam = 'direction'
    public readonly params = {
        'direction': {
            default: 'h',
            validate: (value) => {
                const parts = value.split('')
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
            validate: isFloatString,
            parse: (value) => value
        },
        'width': {
            default: null,
            validate: isCSSValueString,
            parse: (value) => value
        }
    } satisfies Element<AlignElementParams>['params']
}

export default AlignElement

import { isString } from 'utils'
import EffectBase from '.'
import { EffectType } from './common'
import type { DataPropertyMap } from 'types/database'
import type { ITextEffect } from 'types/database/effect'

class TextEffect extends EffectBase implements ITextEffect {
    public readonly type = EffectType.Text
    public readonly text: string

    public constructor(data: Partial<ITextEffect>) {
        super(data)
        this.text = data.text ?? TextEffect.properties.text.value
    }

    public static properties: DataPropertyMap<ITextEffect, TextEffect> = {
        ...EffectBase.properties,
        type: {
            value: EffectType.Text,
            validate: (value) => value === EffectType.Text
        },
        text: {
            value: '',
            validate: isString
        }
    }
}

export default TextEffect

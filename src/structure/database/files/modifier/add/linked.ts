import ModifierAddDataBase, { ModifierAddType } from '.'
import type Modifier from '../modifier'
import { asNumber, isNumber, isObjectId, isString } from 'utils'
import type { ObjectId, Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierAddLinkedData } from 'types/database/files/modifier'
import { SourceType } from '../modifier'

class ModifierAddLinkedData extends ModifierAddDataBase implements IModifierAddLinkedData {
    public override readonly subtype = ModifierAddType.Linked
    public readonly category: string
    public readonly numChoices: number

    public constructor(data: Simplify<IModifierAddLinkedData>) {
        super(data)
        this.category = data.category ?? ModifierAddLinkedData.properties.category.value
        this.numChoices = asNumber(data.numChoices, ModifierAddLinkedData.properties.numChoices.value)
    }

    public static properties: DataPropertyMap<IModifierAddLinkedData, ModifierAddLinkedData> = {
        ...ModifierAddDataBase.properties,
        subtype: {
            value: ModifierAddType.Linked,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        category: {
            value: '',
            validate: isString
        },
        numChoices: {
            value: 1,
            validate: isNumber
        }
    }

    public override apply(modifier: Modifier, key: string): void {
        modifier.addChoice({
            source: this,
            type: 'linked',
            category: this.category,
            numChoices: this.numChoices
        }, key)
        modifier.abilities.subscribe({
            key: key,
            data: this,
            apply: function (value, choices): Record<string, ObjectId | string> {
                const linked = this.data as ModifierAddLinkedData
                const choice: unknown = choices[key]
                if (!Array.isArray(choice)) {
                    return value
                }

                const res = { ...value }
                for (let i = 0; i < linked.numChoices; i++) {
                    const id = choice[i]
                    if (isObjectId(id)) {
                        const addedKey = `${key}.${id}`
                        res[addedKey] = id
                        modifier.addSource(addedKey, SourceType.Modifier, key)
                    }
                }

                return res
            }
        })
    }
}

export default ModifierAddLinkedData

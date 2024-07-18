import ModifierAddDataBase, { ModifierAddType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { asEnum, asNumber, isEnum, isNumber, isObjectId } from 'utils'
import type { ObjectId, Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierAddLinkedData } from 'types/database/files/modifier'
import { ModifierSourceType } from '../modifier'

export enum LinkedCategoryType {
    Feat = 'feat',
    FightingStyle = 'fightingStyle'
}

class ModifierAddLinkedData extends ModifierAddDataBase implements IModifierAddLinkedData {
    public override readonly subtype = ModifierAddType.Linked
    public readonly category: LinkedCategoryType
    public readonly numChoices: number

    public constructor(data: Simplify<IModifierAddLinkedData>) {
        super(data)
        this.category = asEnum(data.category, LinkedCategoryType) ?? ModifierAddLinkedData.properties.category.value
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
            value: LinkedCategoryType.Feat,
            validate: (value) => isEnum(value, LinkedCategoryType)
        },
        numChoices: {
            value: 1,
            validate: isNumber
        }
    }

    public override apply(modifier: Modifier, self: ModifierDocument, key: string): void {
        modifier.addChoice({
            source: this,
            type: 'linked',
            category: this.category,
            numChoices: this.numChoices
        }, key)
        modifier.abilities.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (value, choices): Array<ObjectId | string> {
                const linked = this.data as ModifierAddLinkedData
                const choice: unknown = choices[key]
                if (!Array.isArray(choice)) {
                    return value
                }

                const res = [...value]
                for (let i = 0; i < linked.numChoices; i++) {
                    const id = choice[i]
                    if (!isObjectId(id)) {
                        continue
                    }

                    res.push(id)
                    modifier.addSource(id, ModifierSourceType.Modifier, key)
                }

                return res
            }
        })
    }
}

export default ModifierAddLinkedData

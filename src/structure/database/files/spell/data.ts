import type { IconType } from 'assets/icons'
import { asEnum, isBoolean, isEnum, isNumber, isRecord, isString } from 'utils'
import { getSpellLevelValue } from 'utils/calculations'
import { CastingTime, Duration, MagicSchool, SpellLevel, type TargetType } from 'structure/dnd'
import type { EffectCondition } from 'structure/database/effectCondition/factory'
import { getOptionType } from 'structure/optionData'
import EmptyToken from 'structure/language/tokens/empty'
import EffectFactory, { type Effect, simplifyEffectRecord } from 'structure/database/effect/factory'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { ISpellDataBase } from 'types/database/files/spell'
import type { TokenContext } from 'types/language'

abstract class SpellDataBase implements ISpellDataBase {
    public readonly name: string
    public readonly description: string
    public readonly notes: string
    public readonly level: SpellLevel
    public readonly school: MagicSchool
    // Time
    public readonly time: CastingTime
    public readonly timeCustom: string
    public readonly timeValue: number
    public readonly duration: Duration
    public readonly durationCustom: string
    public readonly durationValue: number
    // Target
    abstract readonly target: TargetType
    abstract readonly condition: EffectCondition
    // Properties
    public readonly allowUpcast: boolean
    public readonly ritual: boolean
    public readonly concentration: boolean
    public readonly componentVerbal: boolean
    public readonly componentSomatic: boolean
    public readonly componentMaterial: boolean
    public readonly materials: string
    // Effects
    public readonly effects: Record<string, Effect>

    public constructor(data: Simplify<ISpellDataBase>) {
        this.name = data.name ?? SpellDataBase.properties.name.value
        this.description = data.description ?? SpellDataBase.properties.description.value
        this.notes = data.notes ?? SpellDataBase.properties.notes.value
        this.level = asEnum(data.level, SpellLevel) ?? SpellDataBase.properties.level.value
        this.school = asEnum(data.school, MagicSchool) ?? SpellDataBase.properties.school.value
        // Time
        this.time = data.time ?? SpellDataBase.properties.time.value
        if (this.time === CastingTime.Custom) {
            this.timeCustom = data.timeCustom ?? SpellDataBase.properties.timeCustom.value
            this.timeValue = SpellDataBase.properties.timeValue.value
        } else {
            this.timeCustom = SpellDataBase.properties.timeCustom.value
            this.timeValue = data.timeValue ?? SpellDataBase.properties.timeValue.value
        }
        this.duration = data.duration ?? SpellDataBase.properties.duration.value
        if (this.duration === Duration.Custom) {
            this.durationCustom = data.durationCustom ?? SpellDataBase.properties.durationCustom.value
            this.durationValue = SpellDataBase.properties.durationValue.value
        } else {
            this.durationCustom = SpellDataBase.properties.durationCustom.value
            this.durationValue = data.durationValue ?? SpellDataBase.properties.durationValue.value
        }
        // Properties
        this.allowUpcast = SpellDataBase.properties.allowUpcast.value
        if (this.level !== SpellLevel.Cantrip) {
            this.allowUpcast = data.allowUpcast ?? this.allowUpcast
        }
        this.ritual = data.ritual ?? SpellDataBase.properties.ritual.value
        this.concentration = data.concentration ?? SpellDataBase.properties.concentration.value
        this.componentVerbal = data.componentVerbal ?? SpellDataBase.properties.componentVerbal.value
        this.componentSomatic = data.componentSomatic ?? SpellDataBase.properties.componentSomatic.value
        this.componentMaterial = data.componentMaterial ?? SpellDataBase.properties.componentMaterial.value
        if (this.componentMaterial) {
            this.materials = data.materials ?? SpellDataBase.properties.materials.value
        } else {
            this.materials = SpellDataBase.properties.materials.value
        }
        // Effects
        this.effects = SpellDataBase.properties.effects.value
        if (data.effects !== undefined) {
            for (const key of Object.keys(data.effects)) {
                const effect = data.effects[key]
                if (effect !== undefined) {
                    this.effects[key] = EffectFactory.create(effect)
                }
            }
        }
    }

    public get levelValue(): number {
        return getSpellLevelValue(this.level)
    }

    public get levelText(): string {
        return getOptionType('spellLevel').options[this.level] ?? String(this.level)
    }

    public get schoolName(): string {
        return getOptionType('magicSchool').options[this.school] ?? String(this.school)
    }

    public get timeText(): string {
        return getOptionType('castingTime').options[this.time] ?? String(this.time)
    }

    public get timeValueText(): string {
        if (this.time === CastingTime.Custom) { return this.timeCustom }
        return this.timeValue > 1
            ? `${this.timeValue} ${this.timeText}s`
            : `${this.timeValue} ${this.timeText}`
    }

    public get durationName(): string {
        return getOptionType('duration').options[this.duration] ?? String(this.duration)
    }

    public get durationText(): string {
        switch (this.duration) {
            case Duration.Custom:
                return this.durationCustom
            case Duration.Instantaneous:
                return this.durationName
            default:
                return this.durationValue > 1
                    ? `${this.durationValue} ${this.durationName}s`
                    : `${this.durationValue} ${this.durationName}`
        }
    }

    public abstract get targetText(): string
    public abstract get targetIcon(): IconType | null

    public static properties: Omit<DataPropertyMap<ISpellDataBase, SpellDataBase>, 'target' | 'condition'> = {
        name: {
            value: '',
            validate: isString
        },
        description: {
            value: '',
            validate: isString
        },
        notes: {
            value: '',
            validate: isString
        },
        level: {
            value: SpellLevel.Cantrip,
            validate: (value) => isEnum(value, SpellLevel)
        },
        school: {
            value: MagicSchool.Abjuration,
            validate: (value) => isEnum(value, MagicSchool)
        },
        // Time
        time: {
            value: CastingTime.Action,
            validate: (value) => isEnum(value, CastingTime)
        },
        timeCustom: {
            value: '',
            validate: isString
        },
        timeValue: {
            value: 1,
            validate: isNumber
        },
        duration: {
            value: Duration.Instantaneous,
            validate: (value) => isEnum(value, Duration)
        },
        durationCustom: {
            value: '',
            validate: isString
        },
        durationValue: {
            value: 1,
            validate: isNumber
        },
        // Properties
        allowUpcast: {
            value: false,
            validate: isBoolean
        },
        ritual: {
            value: false,
            validate: isBoolean
        },
        concentration: {
            value: false,
            validate: isBoolean
        },
        componentVerbal: {
            value: false,
            validate: isBoolean
        },
        componentSomatic: {
            value: false,
            validate: isBoolean
        },
        componentMaterial: {
            value: false,
            validate: isBoolean
        },
        materials: {
            value: '',
            validate: isString
        },
        // Effects
        effects: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, value) => key.length > 0 && EffectFactory.validate(value)),
            simplify: simplifyEffectRecord
        }
    }

    public createContexts(elements: ElementDefinitions): [TokenContext] {
        const descriptionContext: TokenContext = {
            title: new EmptyToken(elements, this.name),
            name: new EmptyToken(elements, this.name)
        }
        return [descriptionContext]
    }
}

export default SpellDataBase

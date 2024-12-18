import { expectNotToBeNull } from 'utils/tests'
import { open5eSpellImporter } from 'utils/importers/open5eImporter'
import { Attribute, CastingTime, DamageType, Duration, MagicSchool, ScalingType, SpellLevel, TargetType } from 'structure/dnd'
import { EffectConditionType } from 'structure/database/effectCondition'
import { IEffectCondition } from 'types/database/effectCondition'
import { EffectCategory, EffectType } from 'structure/database/effect/common'
import { IEffect } from 'types/database/effect'
import { DieType } from 'structure/dice'

describe('Open5e Importer Tests', () => {
    test('Test importing \'Acid Arrow\' spell', async () => {
        const result = await open5eSpellImporter("acid-arrow")
        if (expectNotToBeNull(result)) {
            expect(result.target).toBe(TargetType.Single)
            if (result.target !== TargetType.Single) {
                return;
            }

            expect(result.name).toBe("Acid Arrow")
            expect(result.description).toContain("A shimmering green arrow streaks")
            expect(result.description).toContain("\\roll[2d4]")
            expect(result.level).toBe(SpellLevel.Level2)
            expect(result.school).toBe(MagicSchool.Evocation)
            expect(result.time).toBe(CastingTime.Action)
            expect(result.duration).toBe(Duration.Instantaneous)
            expect(result.allowUpcast).toBe(true)
            expect(result.ritual).toBe(false)
            expect(result.concentration).toBe(false)
            expect(result.componentMaterial).toBe(true)
            expect(result.componentSomatic).toBe(true)
            expect(result.componentVerbal).toEqual(true)
            expect(result.materials).toEqual("Powdered rhubarb leaf and an adder's stomach.")
            expect(result.range).toBe(90)

            expect(result.condition).toEqual({
                scaling: {
                    [ScalingType.SpellModifier]: 1,
                    [ScalingType.Proficiency]: 1,
                },
                type: EffectConditionType.Hit
            } as IEffectCondition)

            expect(result.effects).toEqual({
                main: {
                    category: EffectCategory.Uncategorized,
                    condition: {},
                    damageType: DamageType.Acid,
                    die: DieType.D4,
                    dieCount: {
                        [ScalingType.Constant]: 2,
                        [ScalingType.SpellLevel]: 1
                    },
                    label: "Damage",
                    scaling: {},
                    type: EffectType.Damage
                } as IEffect
            } as Record<string, IEffect>)
        }
    })

    test('Test importing \'Bane\' spell', async () => {
        const result = await open5eSpellImporter("bane")
        if (expectNotToBeNull(result)) {
            expect(result.target).toBe(TargetType.Multiple)
            if (result.target !== TargetType.Multiple) {
                return;
            }

            expect(result.name).toBe("Bane")
            expect(result.description).toContain("Up to three creatures of your choice that you can see within range")
            expect(result.description).toContain("\\roll[d4]")
            expect(result.level).toBe(SpellLevel.Level1)
            expect(result.school).toBe(MagicSchool.Enchantment)
            expect(result.time).toBe(CastingTime.Action)
            expect(result.duration).toBe(Duration.Minute)
            expect(result.durationValue).toBe(1)
            expect(result.allowUpcast).toBe(true)
            expect(result.ritual).toBe(false)
            expect(result.concentration).toBe(true)
            expect(result.componentMaterial).toBe(true)
            expect(result.componentSomatic).toBe(true)
            expect(result.componentVerbal).toEqual(true)
            expect(result.materials).toEqual("A drop of blood.")
            expect(result.range).toBe(30)
            expect(result.count).toBe(3)

            expect(result.condition).toEqual({
                attribute: Attribute.CHA,
                scaling: {
                    [ScalingType.SpellModifier]: 1,
                    [ScalingType.Proficiency]: 1,
                },
                type: EffectConditionType.Save
            } as IEffectCondition)

            expect(result.effects).toEqual({
                main: {
                    condition: {},
                    label: "Effect",
                    text: "Bane",
                    type: EffectType.Text
                } as IEffect
            } as Record<string, IEffect>)
        }
    })
})

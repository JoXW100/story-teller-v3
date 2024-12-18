import { CalcMode, CalcValue } from 'structure/database'
import { DieType } from 'structure/dice'
import { Alignment, Attribute, CreatureType, Language, MovementType, OptionalAttribute, ProficiencyLevel, SizeType, Skill } from 'structure/dnd'
import { open5eCreatureImporter } from 'utils/importers/open5eImporter'
import { expectNotToBeNull } from 'utils/tests'

describe('Open5e Importer Tests', () => {
    test('Test importing \'Aboleth\' creature', async () => {
        const result = await open5eCreatureImporter("aboleth")
        if (expectNotToBeNull(result)) {
            expect(result.name).toBe("Aboleth")
            expect(result.type).toBe(CreatureType.Aberration)
            expect(result.size).toBe(SizeType.Large)
            expect(result.alignment).toBe(Alignment.LawfulEvil)
            // Stats
            expect(result.level).toBe(18)
            expect(result.hitDie).toBe(DieType.D10)
            expect(result.health).toEqual({ mode: CalcMode.Override, value: 135 } as CalcValue)
            expect(result.ac).toEqual({ mode: CalcMode.Override, value: 17 } as CalcValue)
            expect(result.proficiency).toEqual({ mode: CalcMode.Auto } as CalcValue)
            expect(result.initiative).toEqual({ mode: CalcMode.Auto } as CalcValue)
            expect(result.speed).toEqual({
                [MovementType.Walk]: 10,
                [MovementType.Swim]: 40
            })
            expect(result.senses).toEqual({})
            // Attributes
            expect(result.str).toBe(21)
            expect(result.dex).toBe(9)
            expect(result.con).toBe(15)
            expect(result.int).toBe(18)
            expect(result.wis).toBe(15)
            expect(result.cha).toBe(18)
            // Passives
            expect(result.passivePerception).toEqual({ mode: CalcMode.Auto } as CalcValue)
            expect(result.passiveInvestigation).toEqual({ mode: CalcMode.Auto } as CalcValue)
            expect(result.passiveInsight).toEqual({ mode: CalcMode.Auto } as CalcValue)
            // Proficiencies
            expect(result.proficienciesSave).toEqual({
                [Attribute.CON]: ProficiencyLevel.Proficient,
                [Attribute.INT]: ProficiencyLevel.Proficient,
                [Attribute.WIS]: ProficiencyLevel.Proficient,
            })
            expect(result.proficienciesSkill).toEqual({
                [Skill.History]: ProficiencyLevel.Proficient,
                [Skill.Perception]: ProficiencyLevel.Proficient
            })
            expect(result.proficienciesTool).toEqual({})
            expect(result.proficienciesLanguage).toEqual({
                [Language.Telepathy]: 120
            })
            expect(result.proficienciesArmor).toEqual({})
            expect(result.proficienciesWeapon).toEqual({})
            // Advantages
            expect(result.advantages).toEqual({})
            expect(result.disadvantages).toEqual({})
            // Resistances
            expect(result.resistances).toEqual({})
            expect(result.vulnerabilities).toEqual({})
            expect(result.damageImmunities).toEqual({})
            expect(result.conditionImmunities).toEqual({})
            // Spells
            expect(result.spellAttribute).toBe(OptionalAttribute.None)
            expect(result.casterLevel).toEqual({ mode: CalcMode.Auto } as CalcValue)
            expect(result.spells).toEqual({})
            expect(result.spellSlots).toEqual({})
            expect(result.ritualCaster).toBe(false)
            // Abilities
            expect(result.abilities).toContain("Multiattack. The aboleth makes three tentacle attacks.")
        }
    })
})

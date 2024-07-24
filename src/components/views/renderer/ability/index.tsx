import { useContext, useMemo } from 'react'
import ChargesRenderer from '../charges'
import EffectRenderer from '../effect'
import AbilityRange from './range'
import Elements, { ElementDictionary } from 'components/elements'
import { Context } from 'components/contexts/file'
import { isDefined, keysOf } from 'utils'
import { EmptyBonusGroup, EmptyCreatureStats } from 'structure/database'
import { AbilityType } from 'structure/database/files/ability/common'
import type { AbilityData } from 'structure/database/files/ability/factory'
import { EffectConditionType } from 'structure/database/effectCondition'
import { RollMethodType, RollType } from 'structure/dice'
import StoryScript from 'structure/language/storyscript'
import type { ObjectId } from 'types'
import type { IBonusGroup, ICreatureStats } from 'types/editor'
import type { IConditionProperties } from 'types/database/condition'
import styles from '../styles.module.scss'
import { useLocalizedText } from 'utils/hooks/localization'

type AbilityRendererProps = React.PropsWithRef<{
    id: ObjectId | string
    data: AbilityData
    open?: boolean
    stats?: ICreatureStats
    classLevel?: number
    attackBonuses?: IBonusGroup
    damageBonuses?: IBonusGroup
    variables?: Record<string, string>
    expendedCharges?: number
    setExpendedCharges?: (value: number) => void
}>

function getBonus(type: AbilityType, bonuses: IBonusGroup): number {
    switch (type) {
        case AbilityType.MeleeAttack:
            return bonuses.bonus
        case AbilityType.MeleeWeapon:
            return bonuses.bonus + bonuses.meleeBonus
        case AbilityType.RangedWeapon:
            return bonuses.bonus + bonuses.rangedBonus
        case AbilityType.ThrownWeapon:
            return bonuses.bonus + bonuses.thrownBonus
        default:
            return 0
    }
}

export const AbilityRenderer: React.FC<AbilityRendererProps> = ({ id, data, open = false, stats = EmptyCreatureStats, classLevel = 0, attackBonuses = EmptyBonusGroup, damageBonuses = EmptyBonusGroup, expendedCharges, setExpendedCharges }) => {
    const [context] = useContext(Context)
    const typeText = useLocalizedText(`enum-abilityType-${data.type}`)
    const descriptionToken = useMemo(() => {
        if (id === context.file.id && isDefined(context.tokens.description)) {
            return context.tokens.description
        } else {
            return StoryScript.tokenize(ElementDictionary, data.description, data.createContexts(ElementDictionary)[0]).root
        }
    }, [context.file.id, context.tokens.description, data, id])

    const properties: IConditionProperties = {
        ...stats,
        attunedItems: 0,
        classLevel: classLevel,
        spellLevel: 0
    }

    switch (data.type) {
        case AbilityType.Skill:
            return <>
                <Elements.align direction='h' weight='1' width='100%'>
                    <Elements.block width='50%' weight={null}>
                        <Elements.b>{data.name}</Elements.b>
                        <Elements.newline/>
                        {typeText}
                        <Elements.newline/>
                        <ChargesRenderer
                            charges={data.evaluateNumCharges(properties)}
                            expended={expendedCharges}
                            setExpended={setExpendedCharges}/>
                    </Elements.block>
                    <Elements.line width='2px'/>
                    <div>
                        <AbilityRange data={data}/>
                        { keysOf(data.effects).map((key) => data.effects[key].condition.evaluate(properties) &&
                            <EffectRenderer
                                key={key}
                                data={data.effects[key]}
                                properties={properties}
                                bonuses={damageBonuses}
                                desc={`${data.name} ${data.effects[key].label}`}
                                tooltipsId='render-effect-rollTooltips'
                                tooltipsArgs={[data.name, data.effects[key].label]}/>
                        )}
                    </div>
                </Elements.align>
                { open && !descriptionToken.isEmpty && <>
                    <Elements.line width='2px'/>
                    { descriptionToken.build() }
                </>}
            </>
        case AbilityType.Attack:
        case AbilityType.MeleeAttack:
        case AbilityType.MeleeWeapon:
        case AbilityType.RangedAttack:
        case AbilityType.RangedWeapon:
        case AbilityType.ThrownWeapon:
            return <>
                <Elements.align direction='h' weight='1' width='100%'>
                    <Elements.block width='50%' weight={null}>
                        <Elements.b>{data.name}</Elements.b>
                        <Elements.newline/>
                        {typeText}
                        <Elements.newline/>
                        <ChargesRenderer
                            charges={data.evaluateNumCharges(properties)}
                            expended={expendedCharges}
                            setExpended={setExpendedCharges}/>
                    </Elements.block>
                    <Elements.line width='2px'/>
                    <div>
                        <AbilityRange data={data}/>
                        { data.condition.type === EffectConditionType.Hit &&
                            <div>
                                <Elements.b>HIT/DC </Elements.b>
                                <Elements.roll
                                    dice={String(data.condition.getModifierValue(properties) + getBonus(data.type, attackBonuses))}
                                    desc={`${data.name} Attack`}
                                    details={null}
                                    tooltips={`Roll ${data.name} Attack`}
                                    critRange={stats.critRange}
                                    mode={RollMethodType.Normal}
                                    type={RollType.Attack}/>
                            </div>
                        }{ data.condition.type === EffectConditionType.Save &&
                            <div>
                                <Elements.b>HIT/DC </Elements.b>
                                <Elements.save
                                    value={data.condition.getModifierValue(properties)}
                                    type={data.condition.attribute}
                                    tooltips={null}/>
                            </div>
                        }{ data.condition.type === EffectConditionType.Check &&
                            <div>
                                <Elements.b>HIT/DC </Elements.b>
                                <Elements.check
                                    value={data.condition.getModifierValue(properties)}
                                    type={data.condition.skill}
                                    tooltips={null}/>
                            </div>
                        }{ keysOf(data.effects).map((key) => data.effects[key].condition.evaluate(properties) &&
                            <EffectRenderer
                                key={key}
                                data={data.effects[key]}
                                properties={properties}
                                bonuses={damageBonuses}
                                desc={`${data.name} ${data.effects[key].label}`}
                                tooltipsId='render-effect-rollTooltips'
                                tooltipsArgs={[data.name, data.effects[key].label]}/>
                        )}
                    </div>
                </Elements.align>
                { open && !descriptionToken.isEmpty && <>
                    <Elements.line width='2px'/>
                    { descriptionToken.build() }
                </>}
            </>
        case AbilityType.Feature:
        case AbilityType.Custom:
        default:
            return <>
                <Elements.align direction='hc' width='100%' weight='1'>
                    <Elements.b>{data.name}</Elements.b>
                    <Elements.fill/>
                    <ChargesRenderer
                        charges={data.evaluateNumCharges(properties)}
                        expended={expendedCharges}
                        setExpended={setExpendedCharges}/>
                </Elements.align>
                { open && descriptionToken.build() }
            </>
    }
}

const AbilityDocumentRenderer: React.FC = () => {
    const [context] = useContext(Context)
    const data = context.file.data as AbilityData

    return (
        <div className={styles.rendererBox} data='true'>
            <AbilityRenderer id={context.file.id} data={data} open/>
        </div>
    )
}

export default AbilityDocumentRenderer
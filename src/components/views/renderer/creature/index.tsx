import { useContext, useMemo, useState } from 'react'
import { Tooltip } from '@mui/material'
import SpellGroups from './spellGroups'
import PageSelector, { type IPageSelectorData } from '../pageSelector'
import AbilityGroups from './abilityGroups'
import SourceTooltips, { type SourceEnumType } from './sourceTooltips'
import AttributesBox from './attributesBox'
import ProficienciesPage from './proficienciesPage'
import { Context } from 'components/contexts/file'
import Elements, { ElementDictionary } from 'components/elements'
import VariableContext from 'components/contexts/variable'
import LocalizedText from 'components/controls/localizedText'
import { keysOf } from 'utils'
import { useLocalizedEnums } from 'utils/hooks/localization'
import { useCreatureFacade } from 'utils/hooks/documents'
import { RollMethodType, RollType } from 'structure/dice'
import type CreatureDocument from 'structure/database/files/creature'
import type { EnumTypeKey, EnumTypeValue } from 'structure/enums'
import { OptionalAttribute, type SpellLevel } from 'structure/dnd'
import type { ISourceBinding } from 'types/database/files/creature'

const Pages = {
    'actions': { key: 'render-page-actions' },
    'proficiencies': { key: 'render-page-proficiencies' }
} as const satisfies Record<string, IPageSelectorData>

type BindingGroupProps<T extends EnumTypeKey> = React.PropsWithRef<{
    type: SourceEnumType
    binding: T
    bindings: Partial<Record<EnumTypeValue<T>, readonly ISourceBinding[]>>
}>

const BindingGroup = <T extends EnumTypeKey>({ type, binding, bindings }: BindingGroupProps<T>): React.ReactNode => {
    const options = useLocalizedEnums(binding)
    return keysOf(bindings).some((key) => bindings[key]!.length > 0) && <div className='flex gap-4'>
        <LocalizedText className='font-bold no-line-break' id={`binding-${type}-title`}/>
        { keysOf(bindings).map((key) => {
            const value = bindings[key]!
            if (value.length <= 0) {
                return null
            }
            return key === 'generic'
                ? <>{ value.map((val, i) => val.description.length > 0 && <span key={i}>{val.description}</span>) }</>
                : <Tooltip key={type} title={<SourceTooltips type={type} sources={bindings[key]} />}>
                    <span>{ options[key] }</span>
                </Tooltip>
        })}
    </div>
}

const CreatureDocumentRenderer: React.FC = () => {
    const [context, dispatch] = useContext(Context)
    const [page, setPage] = useState<keyof typeof Pages>('actions')
    const { facade, abilities, spells, variables } = useCreatureFacade(context.file as CreatureDocument)
    const descriptionToken = useMemo(() => {
        return context.file.getTokenizedDescription(ElementDictionary)
    }, [context.file])

    const handleSetExpandedAbilityCharges = (charges: Partial<Record<string, number>>): void => {
        dispatch.setStorage('abilitiesExpendedCharges', charges)
    }

    const handleSetExpandedSpellSlots = (spellSlots: Partial<Record<SpellLevel, number>>): void => {
        dispatch.setStorage('spellsExpendedSlots', spellSlots)
    }

    return <VariableContext variables={variables}>
        <Elements.align direction='h' weight={null} width={null}>
            <Elements.block weight='1' width={null}>
                <Elements.h1 underline={false}>{facade.name}</Elements.h1>
                <div className='no-line-break'>
                    {`${facade.sizeText} ${facade.typeText}, ${facade.alignmentText}`}
                </div>
                <Elements.line width='2px'/>
                <div className='no-line-break square'>
                    <Elements.image href={facade.portrait} border={false} weight={null} width={null}/>
                </div>
                <Elements.line width='2px'/>
                <div><Elements.bold>Armor Class </Elements.bold>{facade.acValue}</div>
                <div><Elements.bold>Hit Points </Elements.bold>
                    {`${facade.healthValue} `}
                    <Elements.roll
                        dice={facade.healthRoll}
                        desc='Health'
                        details={null}
                        tooltips={null}
                        critRange={facade.critRange}
                        critDieCount={facade.critDieCount}
                        mode={RollMethodType.Normal}
                        type={RollType.Health}/>
                </div>
                <div>
                    <Elements.bold>Initiative </Elements.bold>
                    <Elements.roll
                        dice={String(facade.initiativeValue)}
                        desc='Initiative'
                        details={null}
                        tooltips="Roll Initiative"
                        critRange={facade.critRange}
                        critDieCount={facade.critDieCount}
                        mode={RollMethodType.Normal}
                        type={RollType.Initiative}/>
                </div>
                <div><Elements.bold>Proficiency Bonus </Elements.bold>
                    <Elements.roll
                        dice={String(facade.proficiencyValue)}
                        desc='Proficiency'
                        details={null}
                        tooltips="Roll Proficiency Check"
                        critRange={facade.critRange}
                        critDieCount={facade.critDieCount}
                        mode={RollMethodType.Normal}
                        type={RollType.Check}/>
                </div>
                <Elements.line width='2px'/>
                <AttributesBox facade={facade}/>
                <Elements.line width='2px'/>
                <Elements.h2 underline={false}>Description</Elements.h2>
                { descriptionToken.build() }
                <Elements.line width='2px'/>
                <div><Elements.bold>Challenge </Elements.bold>{facade.challengeText}</div>
                <BindingGroup type='advantage' binding='advantageBinding' bindings={facade.advantages}/>
                <BindingGroup type='disadvantage' binding='advantageBinding' bindings={facade.disadvantages}/>
                <BindingGroup type='vulnerability' binding='damageBinding' bindings={facade.vulnerabilities}/>
                <BindingGroup type='resistance' binding='damageBinding' bindings={facade.resistances}/>
                <BindingGroup type='damageImmunity' binding='damageBinding' bindings={facade.damageImmunities}/>
                <BindingGroup type='conditionImmunity' binding='conditionBinding' bindings={facade.conditionImmunities}/>
                <div><Elements.bold>Speed </Elements.bold>{facade.speedAsText}</div>
                { Object.keys(facade.senses).length > 0 &&
                    <div><Elements.bold>Senses </Elements.bold>
                        {facade.sensesAsText}
                    </div>
                }
                <Elements.space/>
                <div><Elements.bold>Passive Perception: </Elements.bold>{facade.passivePerceptionValue}</div>
                <div><Elements.bold>Passive Investigation: </Elements.bold>{facade.passiveInvestigationValue}</div>
                <div><Elements.bold>Passive Insight: </Elements.bold>{facade.passiveInsightValue}</div>
            </Elements.block>
            <Elements.line width='2px'/>
            <Elements.block weight='1' width={null}>
                <PageSelector pages={Pages} selected={page} setSelected={setPage}/>
                <Elements.line width='2px'/>
                <div>
                    { page === 'actions' &&
                        <AbilityGroups
                            facade={facade}
                            abilities={abilities}
                            expendedCharges={facade.storage.abilitiesExpendedCharges}
                            setExpendedCharges={handleSetExpandedAbilityCharges}/>
                    }
                    { page === 'proficiencies' &&
                        <ProficienciesPage facade={facade}/>
                    }
                </div>
            </Elements.block>
        </Elements.align>
        { (Object.keys(spells).length > 0 || facade.spellAttribute !== OptionalAttribute.None) &&
            <>
                <Elements.line width='3px'/>
                <Elements.align direction='h' weight='1' width={null}>
                    <Elements.align direction='h' weight='2' width={null}>
                        <Elements.h2 underline={false}> Spells: </Elements.h2>
                    </Elements.align>
                    <Elements.align direction='vc' weight='1.5' width={null}>
                        <Elements.bold>Spellcasting Attribute</Elements.bold>
                        { facade.translator(`enum-optionalAttr-${facade.spellAttribute}`) }
                    </Elements.align>
                    <Elements.align direction='vc' weight='1' width={null}>
                        <Elements.b>Spell Modifier</Elements.b>
                        <Elements.roll
                            dice={String(facade.getSpellAttributeValue())}
                            desc='Spell Modifier'
                            details={null}
                            tooltips={null}
                            critRange={facade.critRange}
                            critDieCount={facade.critDieCount}
                            mode={RollMethodType.Normal}
                            type={RollType.Generic}/>
                    </Elements.align>
                    <Elements.space/>
                    <Elements.align direction='vc' weight='1' width={null}>
                        <Elements.b>Spell Attack</Elements.b>
                        <Elements.roll
                            dice={String(facade.getSpellAttackModifier())}
                            desc='Spell Attack'
                            details={null}
                            tooltips={null}
                            critRange={facade.critRange}
                            critDieCount={facade.critDieCount}
                            mode={RollMethodType.Normal}
                            type={RollType.Attack}/>
                    </Elements.align>
                    <Elements.space/>
                    <Elements.align direction='vc' weight='1' width={null}>
                        <Elements.bold>Spell Save</Elements.bold>
                        <Elements.save value={facade.getSpellSaveModifier()} type={null} tooltips={null}/>
                    </Elements.align>
                </Elements.align>
                <SpellGroups
                    facade={facade}
                    spells={spells}
                    spellSlots={facade.spellSlots}
                    expendedSlots={facade.storage.spellsExpendedSlots}
                    setExpendedSlots={handleSetExpandedSpellSlots}/>
            </>
        }
    </VariableContext>
}

export default CreatureDocumentRenderer

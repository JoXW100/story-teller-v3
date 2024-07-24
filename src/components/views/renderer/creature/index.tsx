import { useContext, useMemo, useState } from 'react'
import AbilityGroups from './abilityGroups'
import PageSelector, { type IPageSelectorData } from '../pageSelector'
import SpellGroups from '../spell/groups'
import AttributesBox from './attributesBox'
import ProficienciesPage from './proficienciesPage'
import { Context } from 'components/contexts/file'
import Elements, { ElementDictionary } from 'components/elements'
import VariableContext from 'components/contexts/variable'
import { isDefined } from 'utils'
import { useCreatureFacade } from 'utils/hooks/documents'
import { OptionalAttribute, type SpellLevel } from 'structure/dnd'
import { RollMethodType, RollType } from 'structure/dice'
import type CreatureDocument from 'structure/database/files/creature'

const Pages = {
    'actions': { key: 'render-page-actions' },
    'proficiencies': { key: 'render-page-proficiencies' }
} as const satisfies Record<string, IPageSelectorData>

const CreatureDocumentRenderer: React.FC = () => {
    const [context, dispatch] = useContext(Context)
    const [page, setPage] = useState<keyof typeof Pages>('actions')
    const { facade, abilities, spells, variables } = useCreatureFacade(context.file as CreatureDocument)
    const stats = useMemo(() => facade.getStats(), [facade])
    const descriptionToken = useMemo(() => {
        if (isDefined(context.tokens.description)) {
            return context.tokens.description
        } else {
            return context.file.getTokenizedDescription(ElementDictionary)
        }
    }, [context.file, context.tokens.description])

    const handleSetExpandedAbilityCharges = (charges: Partial<Record<string, number>>): void => {
        dispatch.setStorage('abilitiesExpendedCharges', charges)
    }

    const handleSetExpandedSpellSlots = (spellSlots: Partial<Record<SpellLevel, number>>): void => {
        dispatch.setStorage('spellsExpendedSlots', spellSlots)
    }

    return <VariableContext variables={variables}>
        <Elements.align direction='h' weight='1' width='100%'>
            <Elements.block weight='1' width='100%'>
                <Elements.h1 underline={false}>{facade.name}</Elements.h1>
                {`${facade.sizeText} ${facade.typeText}, ${facade.alignmentText}`}
                <Elements.line width='2px'/>
                <Elements.image href={facade.portrait} border={false} weight={null} width={null}/>
                <Elements.line width='2px'/>
                <div><Elements.bold>Armor Class </Elements.bold>{facade.acValue}</div>
                <div><Elements.bold>Hit Points </Elements.bold>
                    {`${facade.healthValue} `}
                    <Elements.roll
                        dice={facade.healthRoll}
                        desc='Health'
                        details={null}
                        tooltips={null}
                        critRange={20}
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
                        critRange={20}
                        mode={RollMethodType.Normal}
                        type={RollType.Initiative}/>
                </div>
                <div><Elements.bold>Proficiency Bonus </Elements.bold>
                    <Elements.roll
                        dice={String(facade.proficiencyValue)}
                        desc='Proficiency'
                        details={null}
                        tooltips="Roll Proficiency Check"
                        critRange={20}
                        mode={RollMethodType.Normal}
                        type={RollType.Check}/>
                </div>
                <Elements.line width='2px'/>
                <AttributesBox data={facade}/>
                <Elements.line width='2px'/>
                <Elements.h2 underline={false}>Description</Elements.h2>
                { descriptionToken.build() }
                <Elements.line width='2px'/>
                <div><Elements.bold>Challenge </Elements.bold>{facade.challengeText}</div>
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
            <Elements.block weight='1' width='100%'>
                <PageSelector pages={Pages} selected={page} setSelected={setPage}/>
                <Elements.line width='2px'/>
                <div>
                    { page === 'actions' &&
                        <AbilityGroups
                            abilities={abilities}
                            facade={facade}
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
                <Elements.align direction='h' weight='1' width='100%'>
                    <Elements.align direction='h' weight='3.6' width='100%'>
                        <Elements.h2 underline={false}> Spells: </Elements.h2>
                    </Elements.align>
                    <Elements.align direction='vc' weight='1' width='100%'>
                        <Elements.b>Spell Modifier</Elements.b>
                        <Elements.roll
                            dice={String(facade.spellAttributeValue)}
                            desc='Spell Modifier'
                            details={null}
                            tooltips={null}
                            critRange={20}
                            mode={RollMethodType.Normal}
                            type={RollType.General}/>
                    </Elements.align>
                    <Elements.space/>
                    <Elements.align direction='vc' weight='1' width='100%'>
                        <Elements.b>Spell Attack</Elements.b>
                        <Elements.roll
                            dice={String(facade.spellAttackModifier)}
                            desc='Spell Attack'
                            details={null}
                            tooltips={null}
                            critRange={20}
                            mode={RollMethodType.Normal}
                            type={RollType.Attack}/>
                    </Elements.align>
                    <Elements.space/>
                    <Elements.align direction='vc' weight='1' width='100%'>
                        <Elements.bold>Spell Save</Elements.bold>
                        <Elements.save value={facade.spellSaveModifier} type={null} tooltips={null}/>
                    </Elements.align>
                </Elements.align>
                <SpellGroups
                    spells={spells}
                    spellSlots={facade.spellSlots}
                    stats={stats}
                    expendedSlots={facade.storage.spellsExpendedSlots}
                    setExpendedSlots={handleSetExpandedSpellSlots}/>
            </>
        }
    </VariableContext>
}

export default CreatureDocumentRenderer

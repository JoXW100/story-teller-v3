import { Tooltip } from '@mui/material'
import SourceTooltips, { SourceEnumType } from './sourceTooltips'
import Elements from 'components/elements'
import LocalizedText from 'components/controls/localizedText'
import Icon from 'components/controls/icon'
import { getSkillAdvantageBinding, getSkillAttributeCheckAdvantageBinding } from 'utils/calculations'
import { useLocalizedEnums } from 'utils/hooks/localization'
import { type AdvantageBinding, ProficiencyLevel, Skill } from 'structure/dnd'
import { RollMethodType, RollType } from 'structure/dice'
import type CreatureFacade from 'structure/database/files/creature/facade'
import type { ISourceBinding } from 'types/sourceBinding'
import { IconType } from 'assets/icons'
import styles from '../styles.module.scss'

function getSkillAdvantageBindingSources(skill: Skill, sources: Partial<Record<AdvantageBinding, readonly ISourceBinding[]>>): ISourceBinding[] {
    const skillBinding = getSkillAdvantageBinding(skill)
    const result: ISourceBinding[] = []
    const bindingSources = sources[skillBinding];
    if (bindingSources !== undefined) {
        for (const source of bindingSources) {
            result.push(source)
        }
    }
    const attrBinding = getSkillAttributeCheckAdvantageBinding(skill)
    const attrSources = sources[attrBinding];
    if (attrSources !== undefined) {
        for (const source of attrSources) {
            result.push(source)
        }
    }
    return result
}

type ProficienciesPageProps = React.PropsWithRef<{
    facade: CreatureFacade
}>

const ProficienciesPage: React.FC<ProficienciesPageProps> = ({ facade }) => {
    const skillOptions = useLocalizedEnums('skill')
    const attributeOptions = useLocalizedEnums('attr')
    const proficiencyLevelOptions = useLocalizedEnums('proficiencyLevel')
    const advantages = facade.advantages
    const disadvantages = facade.disadvantages
    return (
        <>
            <div className={styles.skillTable}>
                <div>
                    <LocalizedText className='font-bold' id='renderer-proficiencies-modifier'/>
                    <span/>
                    <LocalizedText className='font-bold' id='renderer-proficiencies-skill'/>
                    <LocalizedText className='font-bold' id='renderer-proficiencies-bonus'/>
                </div>
                { Object.values(Skill).map((skill) => {
                    const advantageSources = getSkillAdvantageBindingSources(skill, advantages)
                    const disadvantageSources = getSkillAdvantageBindingSources(skill, disadvantages)
                    const sources = {} as Partial<Record<SourceEnumType, ISourceBinding[]>>
                    let icon = null as IconType | null

                    if (advantageSources.length > 0) {
                        sources['advantage'] = advantageSources
                        icon = 'advantage'
                    }
                    if (disadvantageSources.length > 0) {
                        sources['disadvantage'] = disadvantageSources
                        icon = icon !== null ? 'advantageDisadvantage' : 'disadvantage'
                    }
                    if (Object.keys(sources).length > 0)
                        console.log("Prof", sources)
                    return (
                        <div key={skill}>
                            <b className='center-flex'>{attributeOptions[facade.getSkillAttribute(skill)]}</b>
                            <Tooltip title={proficiencyLevelOptions[facade.proficienciesSkill[skill] ?? ProficiencyLevel.None]}>
                                <div className={styles.proficiencyMarker} data={facade.proficienciesSkill[skill] ?? 'none'}/>
                            </Tooltip>
                            <div className='center-vertical-flex'>{skillOptions[skill]}</div>
                            <div className='center-vertical-flex relative'>
                                <Elements.roll
                                dice={String(facade.getSkillModifier(skill))}
                                desc={`${skillOptions[skill]} Check`}
                                details={null}
                                tooltips={`Roll ${skillOptions[skill]} Check`}
                                critRange={facade.critRange}
                                critDieCount={facade.critDieCount}
                                mode={RollMethodType.Normal}
                                type={RollType.Check}/>
                                { icon !== null &&
                                    <Tooltip title={<SourceTooltips sources={sources}/>}>
                                        <span className={styles.proficiencyIconHolder}>
                                            <Icon className='small-icon' icon={icon}/>
                                        </span>
                                    </Tooltip>
                                }
                            </div>
                        </div>
                    )
                })}
            </div>
            <Elements.h3 underline={false}>
                <LocalizedText id='renderer-proficiencies-senses'/>
            </Elements.h3>
            <div>{facade.sensesAsText}</div>
            <Elements.h3 underline={false}>
                <LocalizedText id='renderer-proficiencies-armor'/>
            </Elements.h3>
            <div>{facade.proficienciesArmorText}</div>
            <Elements.h3 underline={false}>
                <LocalizedText id='renderer-proficiencies-weapons'/>
            </Elements.h3>
            <div>{facade.proficienciesWeaponText}</div>
            <Elements.h3 underline={false}>
                <LocalizedText id='renderer-proficiencies-languages'/>
            </Elements.h3>
            <div>{facade.proficienciesLanguageText}</div>
            <Elements.h3 underline={false}>
                <LocalizedText id='renderer-proficiencies-tools'/>
            </Elements.h3>
            <div>{facade.proficienciesToolText}</div>
        </>
    )
}

export default ProficienciesPage

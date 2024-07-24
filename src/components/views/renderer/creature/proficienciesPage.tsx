import { Tooltip } from '@mui/material'
import { getOptionType } from 'structure/optionData'
import Elements from 'components/elements'
import LocalizedText from 'components/controls/localizedText'
import Icon from 'components/controls/icon'
import SourceTooltips from './sourceTooltips'
import { keysOf } from 'utils'
import { SkillAdvantageBindingMap } from 'utils/calculations'
import { ProficiencyLevel } from 'structure/dnd'
import { RollMethodType, RollType } from 'structure/dice'
import type CreatureFacade from 'structure/database/files/creature/facade'
import styles from '../styles.module.scss'

type DataProps = React.PropsWithRef<{
    facade: CreatureFacade
}>

const ProficienciesPage = ({ facade }: DataProps): JSX.Element => {
    const skillOptions = getOptionType('skill').options
    const attributeOptions = getOptionType('attr').options
    return (
        <>
            <div className={styles.skillTable}>
                <div>
                    <LocalizedText className='font-bold' id='renderer-proficiencies-modifier'/>
                    <span/>
                    <LocalizedText className='font-bold' id='renderer-proficiencies-skill'/>
                    <span/>
                    <LocalizedText className='font-bold' id='renderer-proficiencies-bonus'/>
                </div>
                { keysOf(skillOptions).map((skill) => {
                    return (
                        <div key={skill}>
                            <b>{attributeOptions[facade.getSkillAttribute(skill)]}</b>
                            <Tooltip title={getOptionType('proficiencyLevel').options[facade.proficienciesSkill[skill] ?? ProficiencyLevel.None]}>
                                <div className={styles.proficiencyMarker} data={facade.proficienciesSkill[skill] ?? 'none'}/>
                            </Tooltip>
                            <div className={styles.label}>{skillOptions[skill]}</div>
                            <div className={styles.iconHolder}>
                                { SkillAdvantageBindingMap[skill] in facade.advantages &&
                                    <Tooltip title={<SourceTooltips type='advantage' binding={SkillAdvantageBindingMap[skill]} values={facade.advantages}/>}>
                                        <span>
                                            <Icon className='small-icon' icon='advantage'/>
                                        </span>
                                    </Tooltip>
                                }
                                { SkillAdvantageBindingMap[skill] in facade.disadvantages &&
                                    <Tooltip title={<SourceTooltips type='disadvantage' binding={SkillAdvantageBindingMap[skill]} values={facade.disadvantages}/>}>
                                        <span>
                                            <Icon className='small-icon' icon='disadvantage'/>
                                        </span>
                                    </Tooltip>
                                }
                            </div>
                            <Elements.roll
                                dice={String(facade.getSkillModifier(skill))}
                                desc={`${skillOptions[skill]} Check`}
                                details={null}
                                tooltips={`Roll ${skillOptions[skill]} Check`}
                                critRange={20}
                                mode={RollMethodType.Normal}
                                type={RollType.Check}/>
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

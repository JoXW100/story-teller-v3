import { useEffect, useMemo, useState } from 'react'
import { Tooltip } from '@mui/material'
import IncreaseIcon from '@mui/icons-material/AddSharp'
import DecreaseIcon from '@mui/icons-material/RemoveSharp'
import EffectRenderer from '../effect'
import LocalizedText from 'components/controls/localizedText'
import Elements, { ElementDictionary } from 'components/elements'
import { asNumber, keysOf } from 'utils'
import { getSpellLevelFromValue, getSpellLevelValue } from 'utils/calculations'
import { useTranslator } from 'utils/hooks/localization'
import { EffectConditionType } from 'structure/database/effectCondition'
import { RollMethodType, RollType } from 'structure/dice'
import { SpellLevel } from 'structure/dnd'
import { type SpellData } from 'structure/database/files/spell/factory'
import StoryScript from 'structure/language/storyscript'
import type { IBonusGroup, IProperties } from 'types/editor'
import styles from '../styles.module.scss'

export type SpellRendererProps = React.PropsWithRef<{
    data: SpellData
    properties: IProperties
    attackBonuses: IBonusGroup
    damageBonuses: IBonusGroup
}>

const SpellRenderer: React.FC<SpellRendererProps> = ({ data, properties, damageBonuses }) => {
    const [upcastLevel, setUpcastLevel] = useState(data.level)
    const translator = useTranslator()
    const targetIconTooltips = data.targetIcon !== null ? translator(`icon-${data.targetIcon}`) : null
    const concentrationIconTooltips = translator('render-spell-concentration')
    const ritualIconTooltips = translator('render-spell-ritual')
    const descriptionToken = useMemo(() => {
        return StoryScript.tokenize(ElementDictionary, data.description, data.createContexts(properties)[0]).root
    }, [data, properties])
    const modifiedProperties: IProperties = { ...properties, spellLevel: asNumber(upcastLevel, 0) }

    useEffect(() => {
        setUpcastLevel(data.level)
    }, [data.level])

    const handleIncrease: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setUpcastLevel((level) => getSpellLevelFromValue(getSpellLevelValue(level) + 1) ?? level)
    }

    const handleDecrease: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setUpcastLevel((level) => getSpellLevelFromValue(getSpellLevelValue(level) - 1) ?? level)
    }

    return <>
        <Elements.align direction='h' width={null} weight='1'>
            <Elements.align direction='v' width={null} weight='1.5'>
                <Elements.b>{data.name}</Elements.b>
                { data.allowUpcast
                    ? <div className={styles.upcastGroup}>
                        <LocalizedText id='render-spell-level' args={[upcastLevel]}/>
                        <Tooltip title={<LocalizedText id='common-increase'/>}>
                            <span>
                                <button
                                    className={styles.upcastButton}
                                    onClick={handleIncrease}
                                    disabled={upcastLevel === SpellLevel.Level9}>
                                    <IncreaseIcon className='fill'/>
                                </button>
                            </span>
                        </Tooltip>
                        <Tooltip title={<LocalizedText id='common-decrease'/>}>
                            <span>
                                <button
                                    className={styles.upcastButton}
                                    onClick={handleDecrease}
                                    disabled={upcastLevel === data.level}>
                                    <DecreaseIcon className='fill'/>
                                </button>
                            </span>
                        </Tooltip>
                    </div>
                    : <span>{data.getLevelText(translator)}</span>
                }
                <Elements.b>School</Elements.b>
                <span>{data.getSchoolNameText(translator)}</span>
            </Elements.align>
            <Elements.align direction='v' width={null} weight='1'>
                <div><Elements.b>Casting</Elements.b>
                    { data.componentVerbal &&
                        <Tooltip title={<LocalizedText id='render-spell-verbal'/>}>
                            <span className={styles.spellComponent}>V</span>
                        </Tooltip>
                    }
                    { data.componentSomatic &&
                        <Tooltip title={<LocalizedText id='render-spell-somatic'/>}>
                            <span className={styles.spellComponent}>S</span>
                        </Tooltip>
                    }
                    { data.componentMaterial &&
                        <Tooltip title={<LocalizedText id='render-spell-material' args={[data.materials]}/>}>
                            <span className={styles.spellComponent}>M</span>
                        </Tooltip>
                    }
                </div>
                <div className={styles.iconRow}>
                    { data.getTimeValueText(translator) }
                    { data.ritual &&
                        <Elements.icon icon='ritual' tooltips={ritualIconTooltips}/>
                    }
                </div>
                <Elements.b>Duration</Elements.b>
                <div className={styles.iconRow}>
                    { data.getDurationText(translator) }
                    { data.concentration &&
                        <Elements.icon icon='concentration' tooltips={concentrationIconTooltips}/>
                    }
                </div>
            </Elements.align>
            <Elements.align direction='v' width={null} weight='1'>
                <div>
                    <LocalizedText id='render-range-area' className='font-bold'/>
                    { data.targetIcon !== null &&
                        <Elements.icon icon={data.targetIcon} tooltips={targetIconTooltips}/>
                    }
                </div>
                { data.targetText }
                { data.notes.length > 0 &&
                    <>
                        <Elements.b>Notes </Elements.b>
                        <div className={styles.iconRow}>
                            { data.notes }
                        </div>
                    </>
                }
            </Elements.align>
            <Elements.align direction='v' width={null} weight='1.2'>
                <div className={styles.iconRow}>
                    <div>
                        <Elements.b>HIT/DC </Elements.b>
                        { data.condition.type === EffectConditionType.Hit &&
                            <Elements.roll
                                dice={String(data.condition.getModifierValue(modifiedProperties))}
                                desc={`${data.name} Attack`}
                                details={null}
                                tooltips={`Roll ${data.name} Attack`}
                                critRange={modifiedProperties.critRange}
                                critDieCount={modifiedProperties.critDieCount}
                                mode={RollMethodType.Normal}
                                type={RollType.Attack}/>
                        }{ data.condition.type === EffectConditionType.Save &&
                            <Elements.save
                                value={data.condition.getModifierValue(modifiedProperties)}
                                type={data.condition.attribute}
                                tooltips={null}/>
                        }{ data.condition.type === EffectConditionType.Check &&
                            <Elements.check
                                value={data.condition.getModifierValue(modifiedProperties)}
                                type={data.condition.skill}
                                tooltips={null}/>
                        }{ data.condition.type === EffectConditionType.None && '-' }
                    </div>
                </div>
                { keysOf(data.effects).map((key) => data.effects[key].condition.evaluate(modifiedProperties) &&
                    <EffectRenderer
                        key={key}
                        data={data.effects[key]}
                        properties={modifiedProperties}
                        bonuses={damageBonuses}
                        desc={`${data.name} ${data.effects[key].label}`}
                        tooltipsId='render-effect-rollTooltips'
                        tooltipsArgs={[data.name, data.effects[key].label]}/>
                )}
            </Elements.align>
        </Elements.align>
        { !descriptionToken.isEmpty && <>
            <Elements.line width='2px'/>
            { descriptionToken.build() }
        </>}
    </>
}

export default SpellRenderer

import { useContext, useEffect, useMemo, useState } from 'react'
import { Tooltip } from '@mui/material'
import IncreaseIcon from '@mui/icons-material/AddSharp'
import DecreaseIcon from '@mui/icons-material/RemoveSharp'
import EffectRenderer from '../effect'
import { Context } from 'components/contexts/file'
import LocalizedText from 'components/controls/localizedText'
import Elements, { ElementDictionary } from 'components/elements'
import { asBooleanString, isDefined, keysOf } from 'utils'
import { getSpellLevelFromValue, getSpellLevelValue } from 'utils/calculations'
import { useTranslator } from 'utils/hooks/localization'
import SpellDataBase from 'structure/database/files/spell/data'
import SpellDataFactory, { type SpellData } from 'structure/database/files/spell/factory'
import { EffectConditionType } from 'structure/database/effectCondition'
import { EmptyBonusGroup, EmptyCreatureStats } from 'structure/database'
import { RollMethodType, RollType } from 'structure/dice'
import { SpellLevel, TargetType } from 'structure/dnd'
import StoryScript from 'structure/language/storyscript'
import type { ObjectId } from 'types'
import type { IBonusGroup, ICreatureStats } from 'types/editor'
import type { ISpellData } from 'types/database/files/spell'
import type { IConditionProperties } from 'types/database/condition'
import styles from '../styles.module.scss'

type SpellRendererProps = React.PropsWithRef<{
    id: ObjectId
    data: SpellData
    stats?: ICreatureStats
    attackBonuses?: IBonusGroup
    damageBonuses?: IBonusGroup
}>

type SpellToggleRendererProps = React.PropsWithRef<{
    id: ObjectId
    data: ISpellData
    stats?: ICreatureStats
    attackBonuses?: IBonusGroup
    damageBonuses?: IBonusGroup
    startCollapsed?: boolean
}>

function getBonus(type: TargetType, bonuses: IBonusGroup): number {
    switch (type) {
        case TargetType.Area:
            return bonuses.bonus + bonuses.areaBonus
        case TargetType.Single:
            return bonuses.bonus + bonuses.singleBonus
        default:
            return 0
    }
}

const SpellRenderer: React.FC<SpellRendererProps> = ({ id, data, stats = EmptyCreatureStats, attackBonuses = EmptyBonusGroup, damageBonuses = EmptyBonusGroup }) => {
    const [context] = useContext(Context)
    const [upcastLevel, setUpcastLevel] = useState(data.level)
    const translator = useTranslator()
    const targetIconTooltips = data.targetIcon !== null ? translator(`icon-${data.targetIcon}`) : null
    const concentrationIconTooltips = translator('render-spell-concentration')
    const ritualIconTooltips = translator('render-spell-ritual')
    const descriptionToken = useMemo(() => {
        if (id === context.file.id && isDefined(context.tokens.description)) {
            return context.tokens.description
        } else {
            return StoryScript.tokenize(ElementDictionary, data.description, data.createContexts(ElementDictionary)[0]).root
        }
    }, [context.file.id, context.tokens.description, data, id])

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

    const properties: IConditionProperties = {
        ...stats,
        attunedItems: 0,
        spellLevel: getSpellLevelValue(upcastLevel)
    }

    return <>
        <Elements.align direction='h' width='100%' weight='1'>
            <Elements.align direction='v' width='100%' weight='1.5'>
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
            <Elements.align direction='v' width='100%' weight='1'>
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
            <Elements.align direction='v' width='100%' weight='1'>
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
            <Elements.align direction='v' width='100%' weight='1.2'>
                <div className={styles.iconRow}>
                    <div>
                        <Elements.b>HIT/DC </Elements.b>
                        { data.condition.type === EffectConditionType.Hit &&
                            <Elements.roll
                                dice={String(data.condition.getModifierValue(properties) + getBonus(data.target, attackBonuses))}
                                desc={`${data.name} Attack`}
                                details={null}
                                tooltips={`Roll ${data.name} Attack`}
                                critRange={stats.critRange}
                                mode={RollMethodType.Normal}
                                type={RollType.Attack}/>
                        }{ data.condition.type === EffectConditionType.Save &&
                            <Elements.save
                                value={data.condition.getModifierValue(properties)}
                                type={data.condition.attribute}
                                tooltips={null}/>
                        }{ data.condition.type === EffectConditionType.Check &&
                            <Elements.check
                                value={data.condition.getModifierValue(properties)}
                                type={data.condition.skill}
                                tooltips={null}/>
                        }{ data.condition.type === EffectConditionType.None && '-' }
                    </div>
                </div>
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
            </Elements.align>
        </Elements.align>
        { !descriptionToken.isEmpty && <>
            <Elements.line width='2px'/>
            { descriptionToken.build() }
        </>}
    </>
}

const SpellClosedRenderer: React.FC<SpellRendererProps> = ({ data, stats }) => {
    const translator = useTranslator()
    const targetIconTooltips = data.targetIcon !== null ? translator(`icon-${data.targetIcon}`) : null
    const concentrationIconTooltips = translator('render-spell-concentration')
    const ritualIconTooltips = translator('render-spell-ritual')
    return (
        <Elements.align direction='h' width='100%' weight='1'>
            <div className={styles.iconRow} style={{ flex: '1.5' }}>
                <Elements.b>{data.name}</Elements.b>
                { data.concentration &&
                    <Elements.icon icon='concentration' tooltips={concentrationIconTooltips}/>
                }
                { data.ritual &&
                    <Elements.icon icon='ritual' tooltips={ritualIconTooltips}/>
                }
            </div>
            <Elements.block weight='0.8' width={null}>
                {data.getTimeText(translator)}
            </Elements.block>
            <Elements.block weight='0.8' width={null}>
                {data.getDurationText(translator)}
            </Elements.block>
            <div className={styles.iconRow} style={{ flex: '0.8' }}>
                {data.targetText}
                {data.targetIcon !== null &&
                    <Elements.icon icon={data.targetIcon} tooltips={targetIconTooltips}/>
                }
            </div>
        </Elements.align>
    )
}

export const SpellToggleRenderer: React.FC<SpellToggleRendererProps> = ({ id, data, stats, startCollapsed = false }) => {
    const [open, setOpen] = useState(!startCollapsed)

    const spell = useMemo(() =>
        data instanceof SpellDataBase
            ? data as SpellData
            : SpellDataFactory.create(data)
    , [data])

    const handleClick = (): void => {
        setOpen((open) => !open)
    }

    const Renderer = open ? SpellRenderer : SpellClosedRenderer

    return (
        <div
            className={styles.rendererBox}
            data={asBooleanString(open)}
            onClick={handleClick}>
            <Renderer id={id} data={spell} stats={stats}/>
        </div>
    )
}

const SpellDocumentRender: React.FC = () => {
    const [context] = useContext(Context)
    const data = context.file.data as SpellData

    return (
        <div className={styles.rendererBox} data='true'>
            <SpellRenderer id={context.file.id} data={data}/>
        </div>
    )
}

export default SpellDocumentRender

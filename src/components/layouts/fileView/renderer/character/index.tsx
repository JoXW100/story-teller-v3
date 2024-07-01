import { Tooltip } from '@mui/material'
import { useContext, useMemo, useState } from 'react'
import AbilityGroups from '../ability/groups'
import PageSelector, { type IPageSelectorData } from '../pageSelector'
import AttributesBox from '../creature/attributesBox'
import ProficienciesPage from '../creature/proficienciesPage'
import HealthBox from './healthBox'
import CharacterBackgroundPage from './backgroundPage'
import CharacterSpellPage from './spellPage'
import CharacterChoicePage from './choicePage'
import { Context } from 'components/contexts/file'
import Elements from 'components/elements'
import LocalizedText from 'components/localizedText'
import Icon from 'components/icon'
import { asBooleanString } from 'utils'
import { useCharacterFacade } from 'utils/hooks/documents'
import { OptionalAttribute } from 'structure/dnd'
import { RollMethodType, RollType } from 'structure/dice'
import type CharacterDocument from 'structure/database/files/character'
import styles from '../styles.module.scss'
import ClassSpellGroups from './classSpellGroups'

const Pages = {
    'actions': { key: 'render-page-actions' },
    'spells': { key: 'render-page-spells' },
    'inventory': { key: 'render-page-inventory' },
    'description': { key: 'render-page-description' },
    'choices': { key: 'render-page-choices' }
} as const satisfies Record<string, IPageSelectorData>

const CharacterDocumentRenderer: React.FC = () => {
    const [context, dispatch] = useContext(Context)
    const [page, setPage] = useState<keyof typeof Pages>('actions')
    const { facade, abilities, spells } = useCharacterFacade(context.file as CharacterDocument)
    const stats = useMemo(() => facade.getStats(), [facade])

    return <>
        <Elements.align direction='h' weight='1' width='100%'>
            <Elements.block weight='1' width='100%'>
                <div className={styles.namePlate}>
                    <div className='no-line-break'>
                        <Elements.image href={facade.portrait} border={false} weight={null} width={null}/>
                    </div>
                    <div>
                        <Elements.h2 underline={false}>{facade.name}</Elements.h2>
                        <div className='no-line-break'>{facade.namePlateText}</div>
                        <div className='no-line-break'><LocalizedText id='render-level' args={[facade.level]}/></div>
                    </div>
                    <div className={styles.restPanel}>
                        <Tooltip title={<LocalizedText id='render-shortRest'/>}>
                            <button className='circularButton square' >
                                <Icon className='small-icon' icon='camp'/>
                            </button>
                        </Tooltip>
                        <Tooltip title={<LocalizedText id='render-longRest'/>}>
                            <button className='circularButton square '>
                                <Icon className='small-icon' icon='night'/>
                            </button>
                        </Tooltip>
                    </div>
                </div>
                <Elements.line width='2px'/>
                <AttributesBox data={facade}/>
                <Elements.space/>
                <Elements.align direction='h' weight='1' width='100%'>
                    <div className={styles.proficiencyBox}>
                        <b>PROF</b>
                        <Elements.roll
                            dice={String(facade.proficiencyValue)}
                            desc='Proficiency Check'
                            details={null}
                            tooltips={null}
                            critRange={20}
                            mode={RollMethodType.Normal}
                            type={RollType.Check}/>
                    </div>
                    <div className={styles.passivesBox}>
                        <b>Passive Perception: </b>
                        <b>{facade.passivePerceptionValue}</b>
                        <b>Passive Investigation: </b>
                        <b>{facade.passiveInvestigationValue}</b>
                        <b>Passive Insight: </b>
                        <b>{facade.passiveInsightValue}</b>
                    </div>
                    <div className={styles.speedBox}>
                        <Elements.b>SPEED</Elements.b>
                        <span>{facade.speedAsText}</span>
                    </div>
                </Elements.align>
                <Elements.space/>
                <ProficienciesPage facade={facade}/>
            </Elements.block>
            <Elements.line width='2px'/>
            <Elements.block weight='1' width='100%'>
                <HealthBox data={facade}/>
                <Elements.space/>
                <PageSelector pages={Pages} selected={page} setSelected={setPage}/>
                <Elements.line width='2px'/>
                <div className={styles.pageItem} data={asBooleanString(page === 'actions')}>
                    <AbilityGroups
                        abilities={abilities}
                        stats={stats}
                        expendedCharges={{}}
                        setExpendedCharges={undefined}/>
                </div>
                <div className={styles.pageItem} data={asBooleanString(page === 'spells')}>
                    <CharacterSpellPage facade={facade} spells={spells} stats={stats} setStorage={dispatch.setStorage}/>
                </div>
                <div className={styles.pageItem} data={asBooleanString(page === 'description')}>
                    <CharacterBackgroundPage facade={facade}/>
                </div>
                <div className={styles.pageItem} data={asBooleanString(page === 'choices')}>
                    <CharacterChoicePage facade={facade}/>
                </div>
            </Elements.block>
        </Elements.align>
        { (Object.keys(spells).length > 0 || facade.spellAttribute !== OptionalAttribute.None) &&
            <>
                <Elements.line width='3px'/>
                <ClassSpellGroups
                    facade={facade}
                    spells={spells}
                    stats={stats}
                    setStorage={dispatch.setStorage}/>
            </>
        }
    </>
}

export default CharacterDocumentRenderer

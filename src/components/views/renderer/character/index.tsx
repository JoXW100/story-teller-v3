import { Tooltip } from '@mui/material'
import { useContext, useState } from 'react'
import AbilityGroups from '../creature/abilityGroups'
import PageSelector, { type IPageSelectorData } from '../pageSelector'
import AttributesBox from '../creature/attributesBox'
import ProficienciesPage from '../creature/proficienciesPage'
import HealthBox from './healthBox'
import CharacterBackgroundPage from './backgroundPage'
import CharacterSpellPage from './spellPage'
import CharacterChoicePage from './choicePage'
import ClassSpellGroups from './classSpellGroups'
import CharacterInventoryPage from './inventoryPage'
import { Context } from 'components/contexts/file'
import VariableContext from 'components/contexts/variable'
import Elements from 'components/elements'
import LocalizedText from 'components/controls/localizedText'
import Icon from 'components/controls/icon'
import { openDialog } from 'components/dialogs/handler'
import { asNumber, keysOf } from 'utils'
import { useCharacterFacade } from 'utils/hooks/documents'
import { RestType } from 'structure/dnd'
import { RollMethodType, RollType } from 'structure/dice'
import type CharacterDocument from 'structure/database/files/character'
import styles from '../styles.module.scss'

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
    const { facade, abilities, spells, variables, items } = useCharacterFacade(context.file as CharacterDocument)

    const handleSetExpandedAbilityCharges = (charges: Partial<Record<string, number>>): void => {
        dispatch.setStorage('abilitiesExpendedCharges', charges)
    }

    const handleShortRest = (): void => {
        openDialog('confirmation', {
            id: 'confirmation-shortRest',
            headerTextId: 'dialog-confirm-shortRest-header',
            bodyTextId: 'dialog-confirm-shortRest-body'
        }).onConfirm(() => {
            const result: Record<string, number> = {}
            for (const key of keysOf(facade.storage.abilitiesExpendedCharges)) {
                const properties = { ...facade.properties, classLevel: facade.getClassLevel(key) }
                const reset = abilities[key]?.evaluateCharges(properties)?.chargesReset
                if (reset !== RestType.ShortRest) {
                    result[key] = asNumber(facade.storage.abilitiesExpendedCharges[key], 0)
                }
            }
            dispatch.setStorage('abilitiesExpendedCharges', result)
        })
    }

    const handleLongRest = (): void => {
        openDialog('confirmation', {
            id: 'confirmation-shortRest',
            headerTextId: 'dialog-confirm-longRest-header',
            bodyTextId: 'dialog-confirm-longRest-body'
        }).onConfirm(() => {
            const result: Record<string, number> = {}
            for (const key of keysOf(facade.storage.abilitiesExpendedCharges)) {
                const properties = { ...facade.properties, classLevel: facade.getClassLevel(key) }
                const reset = abilities[key]?.evaluateCharges(properties)?.chargesReset
                if (reset !== RestType.ShortRest && reset !== RestType.LongRest) {
                    result[key] = asNumber(facade.storage.abilitiesExpendedCharges[key], 0)
                }
            }
            dispatch.setStorage('abilitiesExpendedCharges', result)
        })
    }

    return <VariableContext variables={variables}>
        <Elements.align direction='h' weight={null} width={null}>
            <Elements.block weight='1' width={null}>
                <div className={styles.namePlate}>
                    <Tooltip title={<Elements.image href={facade.portrait} border weight={null} width={null}/>}>
                        <div className='no-line-break square'>
                            <Elements.image href={facade.portrait} border={false} weight={null} width={null}/>
                        </div>
                    </Tooltip>
                    <div>
                        <Elements.h2 underline={false}>{facade.name}</Elements.h2>
                        <Tooltip title={facade.className}>
                            <div className='no-line-break'>
                                {facade.namePlateText}
                            </div>
                        </Tooltip>
                        <div className='no-line-break'>
                            <LocalizedText id='render-level' args={[facade.level]}/>
                        </div>
                    </div>
                    <div className={styles.restPanel}>
                        <Tooltip title={<LocalizedText id='render-shortRest'/>}>
                            <button className='circular-center square small-icon' onClick={handleShortRest}>
                                <Icon className='square fill' icon='camp'/>
                            </button>
                        </Tooltip>
                        <Tooltip title={<LocalizedText id='render-longRest'/>}>
                            <button className='circular-center square small-icon' onClick={handleLongRest}>
                                <Icon className='square fill' icon='night'/>
                            </button>
                        </Tooltip>
                    </div>
                </div>
                <Elements.line width='2px'/>
                <AttributesBox facade={facade}/>
                <Elements.space/>
                <Elements.align direction='h' weight={null} width={null}>
                    <div className={styles.proficiencyBox}>
                        <b>PROF</b>
                        <Elements.roll
                            dice={String(facade.proficiencyValue)}
                            desc='Proficiency Check'
                            details={null}
                            tooltips={null}
                            critRange={facade.critRange}
                            critDieCount={facade.critDieCount}
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
            <Elements.block weight='1' width={null}>
                <HealthBox facade={facade}/>
                <Elements.space/>
                <PageSelector pages={Pages} selected={page} setSelected={setPage}/>
                <Elements.line width='2px'/>
                <div>
                    { page === 'actions' &&
                        <AbilityGroups
                            abilities={abilities}
                            facade={facade}
                            expendedCharges={facade.storage.abilitiesExpendedCharges}
                            setExpendedCharges={handleSetExpandedAbilityCharges}/>
                    }{ page === 'spells' &&
                        <CharacterSpellPage
                            facade={facade}
                            spells={spells}
                            setStorage={dispatch.setStorage}/>
                    }{ page === 'inventory' &&
                        <CharacterInventoryPage facade={facade} items={items}/>
                    }{ page === 'description' &&
                        <CharacterBackgroundPage facade={facade}/>
                    }{ page === 'choices' &&
                        <CharacterChoicePage facade={facade}/>
                    }
                </div>
            </Elements.block>
        </Elements.align>
        { Object.keys(spells).length > 0 &&
            <>
                <Elements.line width='3px'/>
                <ClassSpellGroups
                    facade={facade}
                    spells={spells}
                    setStorage={dispatch.setStorage}/>
            </>
        }
    </VariableContext>
}

export default CharacterDocumentRenderer

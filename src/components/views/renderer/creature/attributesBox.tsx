import { Tooltip } from '@mui/material'
import Elements from 'components/elements'
import Icon from 'components/controls/icon'
import SourceTooltips from './sourceTooltips'
import { getAttributeSaveAdvantageBinding } from 'utils/calculations'
import { useLocalizedEnums } from 'utils/hooks/localization'
import { Attribute } from 'structure/dnd'
import { RollMethodType, RollType } from 'structure/dice'
import type CreatureFacade from 'structure/database/files/creature/facade'
import styles from '../styles.module.scss'

type AttributesBoxParams = React.PropsWithRef<{
    facade: CreatureFacade
}>

const AttributesBox: React.FC<AttributesBoxParams> = ({ facade }) => {
    const options = useLocalizedEnums('attr')
    const advantages = facade.advantages
    const disadvantages = facade.disadvantages
    return (
        <Elements.align direction='h' weight={null} width={null}>
            { Object.values(Attribute).map((attr, index) => {
                const name = options[attr]
                const binding = getAttributeSaveAdvantageBinding(attr)
                return (
                    <div className={styles.attributeBox} key={index}>
                        <Elements.bold>{name}</Elements.bold>
                        <Elements.bold>{facade[attr] ?? 0}</Elements.bold>
                        <Elements.roll
                            dice={String(facade.getAttributeModifier(attr))}
                            desc={`${name} Check`}
                            details={null}
                            tooltips={`Roll ${name} Check`}
                            critRange={facade.critRange}
                            critDieCount={facade.critDieCount}
                            mode={RollMethodType.Normal}
                            type={RollType.Check}/>
                        <div/>
                        <Elements.roll
                            dice={String(facade.getSaveModifier(attr))}
                            desc={`${name} Save`}
                            details={null}
                            tooltips={`Roll ${name} Save`}
                            critRange={facade.critRange}
                            critDieCount={facade.critDieCount}
                            mode={RollMethodType.Normal}
                            type={RollType.Save}/>
                        <span className={styles.iconHolder}>
                            <Tooltip title={binding in advantages && <SourceTooltips type='advantage' sources={advantages[binding]}/>}>
                                <span disabled={!(binding in advantages)}>
                                    <Icon className='small-icon' icon='advantage'/>
                                </span>
                            </Tooltip>
                            <Tooltip title={binding in disadvantages && <SourceTooltips type='disadvantage' sources={disadvantages[binding]}/>}>
                                <span disabled={!(binding in disadvantages)}>
                                    <Icon className='small-icon' icon='disadvantage'/>
                                </span>
                            </Tooltip>
                        </span>
                    </div>
                )
            })}
        </Elements.align>
    )
}
export default AttributesBox

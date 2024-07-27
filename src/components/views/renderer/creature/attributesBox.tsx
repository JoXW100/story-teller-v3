import { Tooltip } from '@mui/material'
import Elements from 'components/elements'
import Icon from 'components/controls/icon'
import SourceTooltips from './sourceTooltips'
import { AttributeAdvantageBindingMap } from 'utils/calculations'
import { useLocalizedEnums } from 'utils/hooks/localization'
import { Attribute } from 'structure/dnd'
import { RollMethodType, RollType } from 'structure/dice'
import type CreatureFacade from 'structure/database/files/creature/facade'
import styles from '../styles.module.scss'

type AttributesBoxParams = React.PropsWithRef<{
    data: CreatureFacade
}>

const AttributesBox: React.FC<AttributesBoxParams> = ({ data }) => {
    const options = useLocalizedEnums('attr')
    return (
        <Elements.align direction='h' weight='1' width='100%'>
            { Object.values(Attribute).map((attr, index) => (
                <div className={styles.attributeBox} key={index}>
                    <Elements.bold>{options[attr]}</Elements.bold>
                    <Elements.bold>{data[attr] ?? 0}</Elements.bold>
                    <Elements.roll
                        dice={String(data.getAttributeModifier(attr))}
                        desc={`${options[attr]} Check`}
                        details={null}
                        tooltips={`Roll ${options[attr]} Check`}
                        critRange={20}
                        mode={RollMethodType.Normal}
                        type={RollType.Check}/>
                    <div/>
                    <Elements.roll
                        dice={String(data.getSaveModifier(attr))}
                        desc={`${options[attr]} Save`}
                        details={null}
                        tooltips={`Roll ${options[attr]} Save`}
                        critRange={20}
                        mode={RollMethodType.Normal}
                        type={RollType.Save}/>
                    <span className={styles.iconHolder}>
                        <Tooltip title={<SourceTooltips type='advantage' binding={AttributeAdvantageBindingMap[attr]} values={data.advantages}/>}>
                            <span disabled={!(AttributeAdvantageBindingMap[attr] in data.advantages)}>
                                <Icon className='small-icon' icon='advantage'/>
                            </span>
                        </Tooltip>
                        <Tooltip title={<SourceTooltips type='disadvantage' binding={AttributeAdvantageBindingMap[attr]} values={data.disadvantages}/>}>
                            <span disabled={!(AttributeAdvantageBindingMap[attr] in data.disadvantages)}>
                                <Icon className='small-icon' icon='disadvantage'/>
                            </span>
                        </Tooltip>
                    </span>
                </div>
            ))}
        </Elements.align>
    )
}
export default AttributesBox

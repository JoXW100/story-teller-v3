import type { SpellRendererProps } from './spell'
import Elements from 'components/elements'
import { useTranslator } from 'utils/hooks/localization'
import styles from '../styles.module.scss'

const SpellClosedRenderer: React.FC<SpellRendererProps> = ({ data }) => {
    const translator = useTranslator()
    const targetIconTooltips = data.targetIcon !== null ? translator(`icon-${data.targetIcon}`) : null
    const concentrationIconTooltips = translator('render-spell-concentration')
    const ritualIconTooltips = translator('render-spell-ritual')
    return (
        <Elements.align direction='h' width={null} weight={null}>
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

export default SpellClosedRenderer

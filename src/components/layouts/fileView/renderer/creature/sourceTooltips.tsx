import Elements from 'components/elements'
import LocalizedText from 'components/localizedText'
import type { AdvantageBinding } from 'structure/dnd'
import type { ISourceBinding } from 'types/database/files/creature'

type SourceTooltipsParams = React.PropsWithRef<{
    type: 'advantage' | 'disadvantage'
    binding: AdvantageBinding
    values: Partial<Record<AdvantageBinding, readonly ISourceBinding[]>>
}>

const SourceTooltips: React.FC<SourceTooltipsParams> = ({ type, binding, values }) => {
    const bindings = values[binding]
    return (
        <span>
            <LocalizedText id={`enum-${type}`}/>
            { bindings?.map((binding, index) => (
                <div key={index}>
                    { binding.description }
                    { binding.source !== null && <LocalizedText id='editor-sourceTooltips-source'/>}
                    { binding.source !== null && <Elements.linkTitle fileId={binding.source} newTab={true}/>}
                </div>
            ))}
        </span>
    )
}

export default SourceTooltips

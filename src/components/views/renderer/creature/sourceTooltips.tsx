import Elements from 'components/elements'
import LocalizedText from 'components/controls/localizedText'
import type { AdvantageBinding } from 'structure/dnd'
import type { ISourceBinding } from 'types/database/files/creature'
import { isObjectId } from 'utils'

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
                    { isObjectId(binding.source?.key) && <>
                        <LocalizedText id='editor-sourceTooltips-source'/>
                        <Elements.linkTitle fileId={binding.source.key} newTab={true}/>
                    </>}
                </div>
            ))}
        </span>
    )
}

export default SourceTooltips

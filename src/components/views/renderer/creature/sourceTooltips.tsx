import Elements from 'components/elements'
import LocalizedText from 'components/controls/localizedText'
import { isObjectId } from 'utils'
import type { ISourceBinding } from 'types/database/files/creature'

export type SourceEnumType = 'advantage' | 'disadvantage' | 'resistance' | 'vulnerability' | 'damageImmunity' | 'conditionImmunity'
type SourceTooltipsParams<T extends string> = React.PropsWithRef<{
    type: SourceEnumType
    binding: T
    values: Partial<Record<T, readonly ISourceBinding[]>>
}>

const SourceTooltips = <T extends string>({ type, binding, values }: SourceTooltipsParams<T>): React.ReactNode => {
    const bindings = values[binding]
    return bindings !== undefined && (
        <span>
            <LocalizedText id={`binding-${type}`}/>
            { bindings?.map((value, index) => (
                <div key={index}>
                    { value.description }
                    { isObjectId(value.source?.key) && <>
                        <LocalizedText id='binding-sourceTooltips'/>
                        <Elements.linkTitle fileId={value.source.key} newTab={true}/>
                    </>}
                </div>
            ))}
        </span>
    )
}

export default SourceTooltips

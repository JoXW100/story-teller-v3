import Elements from 'components/elements'
import { isObjectId } from 'utils'
import { useTranslator } from 'utils/hooks/localization'
import type { ISourceBinding } from 'types/database/files/creature'

export type SourceEnumType = 'advantage' | 'disadvantage' | 'resistance' | 'vulnerability' | 'damageImmunity' | 'conditionImmunity'
type SourceTooltipsParams = React.PropsWithRef<{
    type: SourceEnumType
    title?: string
    sources?: readonly ISourceBinding[]
}>

const SourceTooltips: React.FC<SourceTooltipsParams> = ({ type, title, sources = [] }) => {
    const translator = useTranslator()
    return sources.length > 0 && (
        <span>
            <b>{`${translator(`binding-${type}`)}: ${title ?? ''}`}</b>
            { sources?.map((value, index) => (
                <div key={index}>
                    {`${value.description.trim()}: `}
                    { isObjectId(value.source?.key) && <>
                        <Elements.linkTitle fileId={value.source.key} newTab={true}/>
                    </>}
                </div>
            ))}
        </span>
    )
}

export default SourceTooltips

import { Fragment } from 'react'
import Elements from 'components/elements'
import { isObjectId, keysOf } from 'utils'
import { useTranslator } from 'utils/hooks/localization'
import { ISourceBinding } from 'types/sourceBinding'

export type SourceEnumType = 'advantage' | 'disadvantage' | 'resistance' | 'vulnerability' | 'damageImmunity' | 'conditionImmunity'
type SourceTooltipsParams = React.PropsWithRef<{
    title?: string
    sources?: Partial<Record<SourceEnumType, readonly ISourceBinding[]>>
}>

const SourceTooltips: React.FC<SourceTooltipsParams> = ({ title, sources }) => {
    const translator = useTranslator()
    return sources && (
        <span>
            { keysOf(sources).map((type, index) => 
                <Fragment key={index}>
                    <b>{`${translator(`binding-${type}`)}: ${title ?? ''}`}</b>
                    { sources[type]?.map((value, index) => (
                        <div key={index}>
                            {`${value.description.trim()}: `}
                            { isObjectId(value.source?.key) &&
                                <Elements.linkTitle fileId={value.source.key} newTab={true}/>
                            }
                        </div>
                    ))}
                </Fragment>
            )}
        </span>
    )
}

export default SourceTooltips

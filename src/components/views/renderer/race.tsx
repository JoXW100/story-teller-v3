import { useContext, useMemo } from 'react'
import { Context } from 'components/contexts/file'
import Elements, { ElementDictionary } from 'components/elements'
import { isDefined } from 'utils'
import { useTranslator } from 'utils/hooks/localization'
import type RaceData from 'structure/database/files/race/data'

const RaceDocumentRenderer: React.FC = (): React.ReactNode => {
    const [context] = useContext(Context)
    const translator = useTranslator()
    const data = context.file.data as RaceData
    const descriptionToken = useMemo(() => {
        if (isDefined(context.tokens.description)) {
            return context.tokens.description
        } else {
            return context.file.getTokenizedDescription(ElementDictionary)
        }
    }, [context.file, context.tokens.description])

    return <>
        <Elements.h1 underline>{data.name}</Elements.h1>
        {`${data.getSizeText(translator)} ${data.getTypeText(translator)}`}
        <Elements.line width='2px'/>
        { descriptionToken.build() }
    </>
}

export default RaceDocumentRenderer

import { useContext, useMemo } from 'react'
import { Context } from 'components/contexts/file'
import Elements, { ElementDictionary } from 'components/elements'
import { useTranslator } from 'utils/hooks/localization'
import type RaceData from 'structure/database/files/race/data'
import StoryScript from 'structure/language/storyscript'

const RaceDocumentRenderer: React.FC = (): React.ReactNode => {
    const [context] = useContext(Context)
    const translator = useTranslator()
    const data = context.file.data as RaceData
    const [, contentContext] = useMemo(() => data.createContexts(ElementDictionary), [data])
    const descriptionToken = contentContext.description
    const contentToken = useMemo(() => {
        return StoryScript.tokenize(ElementDictionary, data.content, contentContext).root
    }, [contentContext, data.content])

    return <>
        <Elements.h1 underline>{data.name}</Elements.h1>
        {`${data.getSizeText(translator)} ${data.getTypeText(translator)}`}
        <Elements.line width='2px'/>
        { descriptionToken?.build() }
        <Elements.line width='2px'/>
        { contentToken.build() }
    </>
}

export default RaceDocumentRenderer

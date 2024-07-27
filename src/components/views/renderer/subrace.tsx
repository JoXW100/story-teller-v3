import { useContext, useMemo } from 'react'
import { Context } from 'components/contexts/file'
import Elements, { ElementDictionary } from 'components/elements'
import LocalizedText from 'components/controls/localizedText'
import StoryScript from 'structure/language/storyscript'
import type SubraceData from 'structure/database/files/subrace/data'

const SubraceDocumentRenderer: React.FC = (): React.ReactNode => {
    const [context] = useContext(Context)
    const data = context.file.data as SubraceData
    const [, contentContext] = useMemo(() => data.createContexts(ElementDictionary), [data])
    const descriptionToken = contentContext.description!
    const contentToken = useMemo(() => {
        return StoryScript.tokenize(ElementDictionary, data.content, contentContext).root
    }, [contentContext, data.content])

    return <>
        <Elements.h1 underline>{data.name}</Elements.h1>
        <LocalizedText className='font-bold' id='render-subraceOf'/>
        { data.parentRace !== null
            ? <Elements.linkTitle fileId={data.parentRace} newTab/>
            : <LocalizedText id='common-missing'/>
        }
        <Elements.line width='2px'/>
        { descriptionToken.build() }
        <Elements.line width='2px'/>
        { contentToken.build() }
    </>
}

export default SubraceDocumentRenderer

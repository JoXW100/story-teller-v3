import { useContext, useMemo } from 'react'
import { Context } from 'components/contexts/file'
import Elements, { ElementDictionary } from 'components/elements'
import { useTranslator } from 'utils/hooks/localization'
import type NPCData from 'structure/database/files/npc/data'
import StoryScript from 'structure/language/storyscript'

const NPCDocumentRenderer: React.FC = (): React.ReactNode => {
    const [context] = useContext(Context)
    const translator = useTranslator()
    const data = context.file.data as NPCData
    const [, contentContext] = useMemo(() => data.createContexts(ElementDictionary), [data])
    const descriptionToken = contentContext.description
    const contentToken = useMemo(() => {
        return StoryScript.tokenize(ElementDictionary, data.content, contentContext).root
    }, [contentContext, data.content])

    return <>
        <Elements.align direction='h' weight={null} width={null}>
            <Elements.block weight='1' width={null}>
                <Elements.h1 underline={false}>{data.name}</Elements.h1>
                <div className='no-line-break'>
                    {data.namePlateText}
                </div>
                <Elements.line width='2px'/>
                <div className='no-line-break square'>
                    <Elements.image href={data.portrait} border={false} weight={null} width={null}/>
                </div>
            </Elements.block>
            <Elements.line width='2px'/>
            <Elements.block weight='1' width={null}>
                <div><Elements.b>Size </Elements.b>{data.getSizeText(translator)}</div>
                <div><Elements.b>Type </Elements.b>{data.getTypeText(translator)}</div>
                <div><Elements.b>Alignment </Elements.b>{data.getAlignmentText(translator)}</div>
                <div><Elements.b>Age </Elements.b>{data.age}</div>
                <div><Elements.b>Height </Elements.b>{data.height}</div>
                <div><Elements.b>Weight </Elements.b>{data.weight}</div>
                <Elements.line width='2px'/>
                <Elements.h2 underline={false}>Description</Elements.h2>
                { descriptionToken?.build() }
            </Elements.block>
        </Elements.align>
        { !contentToken.isEmpty &&
            <>
                <Elements.line width='2px'/>
                contentToken.build()
            </>
        }
    </>
}

export default NPCDocumentRenderer

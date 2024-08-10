import { useContext, useMemo } from 'react'
import ModifierDataRender from './modifier'
import { Context } from 'components/contexts/file'
import Elements, { ElementDictionary } from 'components/elements'
import LocalizedText from 'components/controls/localizedText'
import { keysOf } from 'utils'
import StoryScript from 'structure/language/storyscript'
import type SubclassData from 'structure/database/files/subclass/data'
import type { ClassLevel } from 'structure/dnd'

type LevelRendererProps = React.PropsWithRef<{
    classData: SubclassData
    level: ClassLevel
}>

const LevelRender: React.FC<LevelRendererProps> = ({ classData, level }) => {
    const data = classData.levels[level]
    return data.modifiers.length > 0 && <>
        <Elements.h2 underline={false}>
            <LocalizedText id='render-class-level' args={[level]}/>
        </Elements.h2>
        { data.modifiers.map((modifier, i) =>
            <ModifierDataRender key={i} data={modifier}/>
        )}
    </>
}

const SubclassRenderer: React.FC = () => {
    const [context] = useContext(Context)
    const data = context.file.data as SubclassData
    const [, contentContext] = useMemo(() => data.createContexts(ElementDictionary), [data])
    const descriptionToken = contentContext.description!
    const contentToken = useMemo(() => {
        return StoryScript.tokenize(ElementDictionary, data.content, contentContext).root
    }, [contentContext, data.content])

    return <>
        <Elements.h1 underline>{context.file.getTitle()}</Elements.h1>
        <LocalizedText className='font-bold' id='render-subclassOf'/>
        { data.parentFile !== null
            ? <Elements.linkTitle fileId={data.parentFile} newTab/>
            : <LocalizedText id='common-missing'/>
        }
        <Elements.line width='2px'/>
        { !descriptionToken.isEmpty &&
            <>
                { descriptionToken.build() }
                <Elements.line width='2px'/>
            </>
        }
        { !contentToken.isEmpty &&
            <>
                { contentToken.build() }
                <Elements.line width='2px'/>
            </>
        }
        { keysOf(data.levels).map((level) =>
            <LevelRender key={level} classData={data} level={level}/>
        )}
    </>
}

export default SubclassRenderer

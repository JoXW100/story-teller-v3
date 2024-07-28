import { useContext, useMemo } from 'react'
import { AbilityRenderer } from './ability'
import { Context } from 'components/contexts/file'
import Elements, { ElementDictionary } from 'components/elements'
import { keysOf } from 'utils'
import { useFilesOfType } from 'utils/hooks/files'
import { useAbilities } from 'utils/hooks/documents'
import StoryScript from 'structure/language/storyscript'
import type ClassData from 'structure/database/files/class/data'
import type { ClassLevel } from 'structure/dnd'
import { DocumentType } from 'structure/database'
import LocalizedText from 'components/controls/localizedText'
import styles from './styles.module.scss'

type LevelRendererProps = React.PropsWithRef<{
    classData: ClassData
    level: ClassLevel
}>
const FileTypes = [DocumentType.Modifier] as const
const LevelRender: React.FC<LevelRendererProps> = ({ classData, level }) => {
    const data = classData.levels[level]
    const [abilities] = useAbilities(data.abilities)
    const [modifiers] = useFilesOfType(data.modifiers, FileTypes)
    const show = level === classData.subclassLevel || data.abilities.length > 0 || data.modifiers.length > 0
    return show && <>
        <Elements.h2 underline={false}>
            <LocalizedText id='render-class-level' args={[level]}/>
        </Elements.h2>
        { level === classData.subclassLevel &&
            <div className={styles.rendererBox}>
                <Elements.h4 underline={false}>
                    <LocalizedText id='render-class-subclass'/>
                </Elements.h4>
                <LocalizedText id='render-class-subclass-body'/>
            </div>
        }{ keysOf(abilities).map((key) =>
            <div key={key} className={styles.rendererBox}>
                <AbilityRenderer data={abilities[key]} open/>
            </div>
        )}
        { modifiers.map((modifier, i) => modifier !== null &&
            <div key={i} className={styles.rendererBox}>
                <Elements.h4 underline={false}>
                    {modifier.getTitle()}
                </Elements.h4>
                { modifier.getTokenizedDescription(ElementDictionary).build() }
            </div>
        )}
    </>
}

const ClassRenderer: React.FC = () => {
    const [context] = useContext(Context)
    const data = context.file.data as ClassData
    const [, contentContext] = useMemo(() => data.createContexts(ElementDictionary), [data])
    const descriptionToken = contentContext.description!
    const contentToken = useMemo(() => {
        return StoryScript.tokenize(ElementDictionary, data.content, contentContext).root
    }, [contentContext, data.content])

    return <>
        <Elements.h1 underline>{context.file.getTitle()}</Elements.h1>
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
        { keysOf(data.levels).map((level) => <LevelRender key={level} classData={data} level={level}/>)}
    </>
}

export default ClassRenderer

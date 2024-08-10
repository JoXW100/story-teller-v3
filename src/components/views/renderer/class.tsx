import { useContext, useMemo } from 'react'
import ModifierDataRender from './modifier'
import { Context } from 'components/contexts/file'
import Elements, { ElementDictionary } from 'components/elements'
import LocalizedText from 'components/controls/localizedText'
import { keysOf } from 'utils'
import { getMaxSpellLevel, getProficiencyBonusFromLevel } from 'utils/calculations'
import { useTranslator } from 'utils/hooks/localization'
import { ClassLevel, OptionalAttribute, SpellLevel } from 'structure/dnd'
import StoryScript from 'structure/language/storyscript'
import type ClassData from 'structure/database/files/class/data'
import { LevelModifyType } from 'structure/database/files/class/levelData'
import styles from './styles.module.scss'

interface IClassLevelSpellData {
    learnedSlots: number
    preparationSlots: number
    spellSlots: Partial<Record<SpellLevel, number>>
    maxSpellLevel: SpellLevel
}

type LevelRendererProps = React.PropsWithRef<{
    classData: ClassData
    level: ClassLevel
}>

const LevelRender: React.FC<LevelRendererProps> = ({ classData, level }) => {
    const data = classData.levels[level]
    const showSubclass = level === classData.subclassLevel
    const modifiers = data.modifiers.filter((modifier) => modifier.name.length > 0)
    const show = showSubclass || modifiers.length > 0
    return show && <>
        <Elements.h2 underline={false}>
            <LocalizedText id='render-class-level' args={[level]}/>
        </Elements.h2>
        { showSubclass &&
            <div className={styles.rendererBox}>
                <Elements.h4 underline={false}>
                    <LocalizedText id='render-class-subclass'/>
                </Elements.h4>
                <LocalizedText id='render-class-subclass-body'/>
            </div>
        }{ modifiers.map((modifier, i) => modifier !== null &&
            <ModifierDataRender key={i} data={modifier}/>
        )}
    </>
}

const ClassRenderer: React.FC = () => {
    const [context] = useContext(Context)
    const translate = useTranslator()
    const data = context.file.data as ClassData
    const [, contentContext] = useMemo(() => data.createContexts(ElementDictionary), [data])
    const descriptionToken = contentContext.description!
    const contentToken = useMemo(() => {
        return StoryScript.tokenize(ElementDictionary, data.content, contentContext).root
    }, [contentContext, data.content])
    const [levelSpellData, showTable, maxSpellLevel] = useMemo(() => {
        let showTable: boolean = false
        let maxSpellLevel: SpellLevel = SpellLevel.Cantrip
        let prev: IClassLevelSpellData = {
            learnedSlots: 0,
            preparationSlots: 0,
            spellSlots: {},
            maxSpellLevel: SpellLevel.Cantrip
        }
        const result: Partial<Record<ClassLevel, IClassLevelSpellData>> = {}
        for (const level of Object.values(ClassLevel)) {
            const levelData = data.levels[level]
            prev = result[level] = { ...prev, spellSlots: { ...prev.spellSlots } }
            switch (levelData.type) {
                case LevelModifyType.Add:
                    prev.learnedSlots += levelData.learnedSlots
                    prev.preparationSlots += levelData.preparationSlots
                    for (const spellLevel of keysOf(levelData.spellSlots)) {
                        prev.spellSlots[spellLevel] = (prev.spellSlots[spellLevel] ?? 0) + (levelData.spellSlots[spellLevel] ?? 0)
                    }
                    break
                case LevelModifyType.Replace:
                    prev.learnedSlots = levelData.learnedSlots
                    prev.preparationSlots = levelData.preparationSlots
                    prev.spellSlots = { ...levelData.spellSlots }
                    break
            }
            prev.maxSpellLevel = getMaxSpellLevel(...keysOf(levelData.spellSlots))
            maxSpellLevel = getMaxSpellLevel(maxSpellLevel, prev.maxSpellLevel)
            showTable ||= levelData.spellAttribute !== OptionalAttribute.None
        }
        return [result as Record<ClassLevel, IClassLevelSpellData>, showTable, maxSpellLevel]
    }, [data])

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
        { showTable &&
            <>
                <table className={styles.classSpellTable}>
                    <thead>
                        <tr>
                            <th>Level</th>
                            <th>Proficiency</th>
                            { !data.learnedAll && <th>Learned Slots</th> }
                            { !data.preparationAll && <th>Preparation Slots</th> }
                            { Object.values(SpellLevel).map((level) => Number(level) <= Number(maxSpellLevel) &&
                                <th key={level}>{translate(`enum-spellLevel-${level}`)}</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        { Object.values(ClassLevel).map((classLevel) =>
                            <tr key={classLevel} hidden={Object.values(levelSpellData[classLevel].spellSlots).length <= 0}>
                                <td>{classLevel}</td>
                                <td>{getProficiencyBonusFromLevel(Number(classLevel))}</td>
                                { !data.learnedAll && <td>{levelSpellData[classLevel].learnedSlots}</td> }
                                { !data.preparationAll && <td>{levelSpellData[classLevel].preparationSlots}</td> }
                                { Object.values(SpellLevel).map((level) => Number(level) <= Number(maxSpellLevel) &&
                                    <td key={level}>{levelSpellData[classLevel].spellSlots[level] ?? '-'}</td>
                                )}
                            </tr>
                        )}
                    </tbody>
                </table>
                <Elements.line width='2px'/>
            </>
        }
        { keysOf(data.levels).map((level) =>
            <LevelRender key={level} classData={data} level={level}/>)
        }
    </>
}

export default ClassRenderer

import { useContext } from 'react'
import TextEditor from 'components/controls/textEditor'
import LocalizedText from 'components/controls/localizedText'
import { Context } from 'components/contexts/file'
import { ElementDictionary } from 'components/elements'
import PublishComponent from './components/publish'
import GroupComponent from './components/group'
import TextComponent from './components/text'
import NumberComponent from './components/number'
import EnumComponent from './components/enum'
import BooleanComponent from './components/boolean'
import EditItemRecordComponent from './components/editItemRecord'
import SelectionInputComponent from './components/selectionInput'
import { AreaType, CastingTime, Duration, SpellLevel, TargetType } from 'structure/dnd'
import SpellDocument from 'structure/database/files/spell'
import { EffectConditionType } from 'structure/database/effectCondition'
import styles from './style.module.scss'

const SpellDocumentEditor: React.FC = () => {
    const [context, dispatch] = useContext(Context)

    if (!(context.file instanceof SpellDocument)) {
        return null
    }

    const [descriptionContext] = context.file.data.createContexts(ElementDictionary)

    return (
        <div className={styles.main}>
            <GroupComponent header={<LocalizedText id='editor-header-data'/>} open>
                <PublishComponent/>
                <TextComponent field='name' labelId='editor-name'/>
                <EnumComponent field='level' labelId='editor-level' type='spellLevel'/>
                <EnumComponent field='school' labelId='editor-school' type='magicSchool'/>
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-time'/>} open>
                <EnumComponent field='time' labelId='editor-time' type='castingTime'/>
                { context.file.data.time === CastingTime.Custom
                    ? <TextComponent field='timeCustom' labelId='editor-timeCustom'/>
                    : <NumberComponent field='timeValue' labelId='editor-timeValue'/>
                }
                <EnumComponent field='duration' labelId='editor-duration' type='duration'/>
                { context.file.data.duration === Duration.Custom
                    ? <TextComponent field='durationCustom' labelId='editor-durationCustom'/>
                    : context.file.data.duration !== Duration.Instantaneous &&
                    <NumberComponent field='durationValue' labelId='editor-durationValue'/>
                }
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-details'/>} open>
                <EnumComponent field='target' type='target' labelId='editor-target'/>
                { (context.file.data.target === TargetType.Single || context.file.data.target === TargetType.Multiple || context.file.data.target === TargetType.Point || context.file.data.target === TargetType.Area) &&
                    <NumberComponent field='range' labelId='editor-range'/>
                }{ context.file.data.target === TargetType.Multiple &&
                    <NumberComponent field='count' labelId='editor-count'/>
                }
                <TextComponent field='notes' labelId='editor-notes'/>
                <EditItemRecordComponent
                    field='effects'
                    labelId='editor-effects'
                    defaultValue={{}}
                    page='effect'/>
            </GroupComponent>
            { (context.file.data.target === TargetType.Self || context.file.data.target === TargetType.Point || context.file.data.target === TargetType.Area) &&
                <GroupComponent header={<LocalizedText id='editor-header-area'/>} open>
                    <EnumComponent field='area.type' labelId='editor-area' type='area' />
                    { (context.file.data.area.type === AreaType.Cone || context.file.data.area.type === AreaType.Square || context.file.data.area.type === AreaType.Cube) &&
                        <NumberComponent field='area.side' labelId='editor-area-side'/>
                    }
                    { (context.file.data.area.type === AreaType.Sphere || context.file.data.area.type === AreaType.Cylinder) &&
                        <NumberComponent field='area.radius' labelId='editor-area-radius'/>
                    }
                    { (context.file.data.area.type === AreaType.Line || context.file.data.area.type === AreaType.Rectangle) &&
                        <NumberComponent field='area.length' labelId='editor-area-length'/>
                    }
                    { (context.file.data.area.type === AreaType.Rectangle || context.file.data.area.type === AreaType.Cuboid) &&
                        <NumberComponent field='area.width' labelId='editor-area-width'/>
                    }
                    { (context.file.data.area.type === AreaType.Cuboid || context.file.data.area.type === AreaType.Cylinder) &&
                        <NumberComponent field='area.height' labelId='editor-area-height'/>
                    }
                </GroupComponent>
            }{ context.file.data.target !== TargetType.None &&
                <GroupComponent header={<LocalizedText id='editor-header-condition'/>} open>
                    <EnumComponent field='condition.type' type='effectCondition' labelId='editor-condition-type'/>
                    { context.file.data.condition.type === EffectConditionType.Hit &&
                        <SelectionInputComponent
                            field='condition.scaling'
                            type='number'
                            optionsType='scaling'
                            labelId='editor-condition-scaling'
                            fill/>
                    }{ context.file.data.condition.type === EffectConditionType.Save &&
                        <>
                            <EnumComponent field='condition.attribute' type='attr' labelId='editor-condition-attribute'/>
                            <SelectionInputComponent
                                field='condition.scaling'
                                type='number'
                                optionsType='scaling'
                                labelId='editor-condition-scaling'
                                fill/>
                        </>
                    }{ context.file.data.condition.type === EffectConditionType.Check &&
                        <>
                            <EnumComponent field='condition.skill' type='skill' labelId='editor-condition-skill'/>
                            <SelectionInputComponent
                                field='condition.scaling'
                                type='number'
                                optionsType='scaling'
                                labelId='editor-condition-scaling'
                                fill/>
                        </>
                    }
                </GroupComponent>
            }
            <GroupComponent header={<LocalizedText id='editor-header-properties'/>} open>
                { context.file.data.level !== SpellLevel.Cantrip &&
                    <BooleanComponent field='allowUpcast' labelId='editor-allowUpcast'/>
                }
                <BooleanComponent field='ritual' labelId='editor-ritual'/>
                <BooleanComponent field='concentration' labelId='editor-concentration'/>
                <BooleanComponent field='componentVerbal' labelId='editor-componentVerbal'/>
                <BooleanComponent field='componentSomatic' labelId='editor-componentSomatic'/>
                <BooleanComponent field='componentMaterial' labelId='editor-componentMaterial'/>
                { context.file.data.componentMaterial &&
                    <TextComponent field='materials' labelId='editor-materials'/>
                }
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-description'/>} open fill>
                <TextEditor
                    value={context.file.data.description}
                    className={styles.editTextEditor}
                    onMount={(token) => { dispatch.setToken('description', token) }}
                    context={descriptionContext}
                    onChange={(text, token) => {
                        dispatch.setData('description', text)
                        dispatch.setToken('description', token)
                    }}/>
            </GroupComponent>
        </div>
    )
}

export default SpellDocumentEditor

import { useContext, useMemo } from 'react'
import { Context } from 'components/contexts/file'
import TextEditor from 'components/textEditor'
import GroupComponent from './components/group'
import LocalizedText from 'components/localizedText'
import TextComponent from './components/text'
import NumberComponent from './components/number'
import EnumComponent from './components/enum'
import EditItemRecordComponent from './components/editItemRecord'
import LinkListComponent from './components/linkList'
import SelectionInputComponent from './components/selectionInput'
import { ElementDictionary } from 'components/elements'
import { AreaType, TargetType } from 'structure/dnd'
import { DocumentType } from 'structure/database'
import AbilityDocument from 'structure/database/files/ability'
import { EffectConditionType } from 'structure/database/effectCondition'
import { AbilityType } from 'structure/database/files/ability/common'
import EffectFactory from 'structure/database/effect/factory'
import styles from './style.module.scss'

const AllowedTypes = [DocumentType.Modifier] as const
const AbilityDocumentEditor: React.FC = () => {
    const [context, dispatch] = useContext(Context)
    const defaultEffectValue = useMemo(() => EffectFactory.create(), [])

    if (!(context.file instanceof AbilityDocument)) {
        return null
    }

    const [descriptionContext] = context.file.data.createContexts(ElementDictionary)

    return (
        <div className={styles.main}>
            <GroupComponent header={<LocalizedText id='editor-header-data'/>} open>
                <TextComponent field='name' labelId='editor-name'/>
                <EnumComponent field='type' type='abilityType' labelId='editor-type' />
                { context.file.data.type === AbilityType.Custom &&
                    <TextComponent field='category' labelId='editor-category'/>
                }
                <EnumComponent field='action' type='action' labelId='editor-action' />
            </GroupComponent>
            { (context.file.data.type === AbilityType.Attack || context.file.data.type === AbilityType.Skill || context.file.data.type === AbilityType.MeleeAttack || context.file.data.type === AbilityType.RangedAttack || context.file.data.type === AbilityType.MeleeWeapon || context.file.data.type === AbilityType.RangedWeapon || context.file.data.type === AbilityType.ThrownWeapon) &&
                  <GroupComponent header={<LocalizedText id='editor-header-details'/>} open>
                      { context.file.data.type === AbilityType.Attack &&
                      <>
                          <EnumComponent field='target' type='target' labelId='editor-target'/>
                          { (context.file.data.target === TargetType.Single || context.file.data.target === TargetType.Multiple || context.file.data.target === TargetType.Point || context.file.data.target === TargetType.Area) &&
                              <NumberComponent field='range' labelId='editor-range'/>
                          }{ context.file.data.target === TargetType.Multiple &&
                              <NumberComponent field='count' labelId='editor-count'/>
                          }
                      </>
                      }{ (context.file.data.type === AbilityType.MeleeAttack || context.file.data.type === AbilityType.MeleeWeapon) &&
                      <NumberComponent field='reach' labelId='editor-reach' />
                      }{ (context.file.data.type === AbilityType.RangedAttack || context.file.data.type === AbilityType.RangedWeapon) &&
                      <>
                          <NumberComponent field='range' labelId='editor-range' />
                          <NumberComponent field='rangeLong' labelId='editor-rangeLong' />
                      </>
                      }{ context.file.data.type === AbilityType.ThrownWeapon &&
                      <>
                          <NumberComponent field='reach' labelId='editor-reach' />
                          <NumberComponent field='range' labelId='editor-range' />
                          <NumberComponent field='rangeLong' labelId='editor-rangeLong' />
                      </>
                      }
                      <EditItemRecordComponent
                          field='effects'
                          labelId='editor-effects'
                          defaultValue={defaultEffectValue}
                          page='effect'/>
                  </GroupComponent>
            }{ context.file.data.type === AbilityType.Attack && (context.file.data.target === TargetType.Self || context.file.data.target === TargetType.Point || context.file.data.target === TargetType.Area) &&
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
            }{ ((context.file.data.type === AbilityType.Attack && context.file.data.target !== TargetType.None) || context.file.data.type === AbilityType.MeleeAttack || context.file.data.type === AbilityType.RangedAttack || context.file.data.type === AbilityType.MeleeWeapon || context.file.data.type === AbilityType.RangedWeapon || context.file.data.type === AbilityType.ThrownWeapon) &&
                <GroupComponent header={<LocalizedText id='editor-header-condition'/>} open>
                    <EnumComponent field='condition.type' type='effectConditionType' labelId='editor-condition-type'/>
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
            <GroupComponent header={<LocalizedText id='editor-header-charges'/>} open>
                <EditItemRecordComponent
                    field='charges'
                    defaultValue={{}}
                    labelId='editor-charges'
                    page='charges'/>
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-modifiers'/>} open>
                <LinkListComponent field='modifiers' labelId='editor-modifiers' allowedTypes={AllowedTypes} fill/>
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-description'/>} open fill>
                <TextEditor
                    value={context.file.data.description}
                    className={styles.editTextEditor}
                    context={descriptionContext}
                    onMount={(token) => { dispatch.setToken('description', token) }}
                    onChange={(text, token) => {
                        dispatch.setData('description', text)
                        dispatch.setToken('description', token)
                    }}/>
            </GroupComponent>
        </div>
    )
}

export default AbilityDocumentEditor

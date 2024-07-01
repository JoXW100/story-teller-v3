import { useContext, useMemo } from 'react'
import { Context } from 'components/contexts/file'
import TextEditor from 'components/textEditor'
import GroupComponent from './components/group'
import LocalizedText from 'components/localizedText'
import TextComponent from './components/text'
import NumberComponent from './components/number'
import EnumComponent from './components/enum'
import LinkListComponent from './components/linkList'
import CalcComponent from './components/calc'
import BooleanComponent from './components/boolean'
import EditItemRecordComponent from './components/editItemRecord'
import { ElementDictionary } from 'components/elements'
import { DocumentType } from 'structure/database'
import AbilityDocument from 'structure/database/files/ability'
import { EffectConditionType } from 'structure/database/effectCondition'
import { AbilityType } from 'structure/database/files/ability/common'
import EffectFactory from 'structure/database/effect/factory'
import styles from './style.module.scss'

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
                <EnumComponent field='action' type='action' labelId='editor-action' />
            </GroupComponent>
            { context.file.data.type === AbilityType.Attack &&
                <GroupComponent header={<LocalizedText id='editor-header-details'/>} open>
                    <EnumComponent field='target' type='target' labelId='editor-target' deps={['type']}/>
                    <NumberComponent field='range' labelId='editor-range' deps={['type']}/>
                    <EditItemRecordComponent
                        field='effects'
                        labelId='editor-effects'
                        defaultValue={defaultEffectValue}
                        page='effect'
                        deps={['type']}/>
                </GroupComponent>
            }
            { (context.file.data.type === AbilityType.MeleeAttack || context.file.data.type === AbilityType.MeleeWeapon) &&
                <GroupComponent header={<LocalizedText id='editor-header-details'/>} open>
                    <NumberComponent field='reach' labelId='editor-reach' deps={['type']}/>
                    <EditItemRecordComponent
                        field='effects'
                        labelId='editor-effects'
                        defaultValue={defaultEffectValue}
                        page='effect'
                        deps={['type']}/>
                </GroupComponent>
            }
            { (context.file.data.type === AbilityType.RangedAttack || context.file.data.type === AbilityType.RangedWeapon) &&
                <GroupComponent header={<LocalizedText id='editor-header-details'/>} open>
                    <NumberComponent field='range' labelId='editor-range' deps={['type']}/>
                    <NumberComponent field='rangeLong' labelId='editor-rangeLong' deps={['type']}/>
                    <EditItemRecordComponent
                        field='effects'
                        labelId='editor-effects'
                        defaultValue={defaultEffectValue}
                        page='effect'
                        deps={['type']}/>
                </GroupComponent>
            }
            { context.file.data.type === AbilityType.ThrownWeapon &&
                <GroupComponent header={<LocalizedText id='editor-header-details'/>} open>
                    <NumberComponent field='reach' labelId='editor-reach' deps={['type']}/>
                    <NumberComponent field='range' labelId='editor-range' deps={['type']}/>
                    <NumberComponent field='rangeLong' labelId='editor-rangeLong' deps={['type']}/>
                    <EditItemRecordComponent
                        field='effects'
                        labelId='editor-effects'
                        defaultValue={defaultEffectValue}
                        page='effect'
                        deps={['type']}/>
                </GroupComponent>
            }
            { context.file.data.type !== AbilityType.Feature &&
                <GroupComponent header={<LocalizedText id='editor-header-condition'/>} open>
                    <EnumComponent field='condition.type' type='effectConditionType' labelId='editor-condition-type' deps={['type']}/>
                    { context.file.data.condition.type === EffectConditionType.Hit &&
                        <>
                            <EnumComponent field='condition.scaling' type='scaling' labelId='editor-condition-scaling' deps={['type', 'condition.type']}/>
                            <BooleanComponent field='condition.proficiency' labelId='editor-condition-proficiency' deps={['type', 'condition.type']}/>
                            <CalcComponent field='condition.modifier' labelId='editor-condition-modifier' deps={['type', 'condition.type']}/>
                        </>
                    }
                    { context.file.data.condition.type === EffectConditionType.Save &&
                        <>
                            <EnumComponent field='condition.attribute' type='attr' labelId='editor-condition-attribute' deps={['type', 'condition.type']}/>
                            <EnumComponent field='condition.scaling' type='scaling' labelId='editor-condition-scaling' deps={['type', 'condition.type']}/>
                            <BooleanComponent field='condition.proficiency' labelId='editor-condition-proficiency' deps={['type', 'condition.type']}/>
                            <CalcComponent field='condition.modifier' labelId='editor-condition-modifier' deps={['type', 'condition.type']}/>
                        </>
                    }
                </GroupComponent>
            }
            <GroupComponent header={<LocalizedText id='editor-header-charges'/>} open>
                <NumberComponent field='charges' labelId='editor-charges'/>
                { context.file.data.charges > 0 &&
                    <EnumComponent field='chargesReset' type='restType' labelId='editor-chargesReset'/>
                }
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-modifiers'/>} open>
                <LinkListComponent field='modifiers' allowedTypes={[DocumentType.Modifier]} labelId='editor-modifiers'/>
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

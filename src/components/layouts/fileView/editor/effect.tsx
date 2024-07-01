import { useContext } from 'react'
import { Context, getRelativeFieldObject } from 'components/contexts/file'
import GroupComponent from './components/group'
import LocalizedText from 'components/localizedText'
import TextComponent from './components/text'
import EnumComponent from './components/enum'
import NavigationComponent from './components/navigation'
import BooleanComponent from './components/boolean'
import NumberComponent from './components/number'
import CalcComponent from './components/calc'
import ConditionComponent from './components/condition'
import { EffectType } from 'structure/database/effect/common'
import { isInstanceOfEffect } from 'structure/database/effect/factory'
import styles from './style.module.scss'

const EffectEditor: React.FC = () => {
    const [context, dispatch] = useContext(Context)
    const page = context.editorPages[context.editorPages.length - 1]
    const field = page?.root
    const deps = page?.deps ?? []
    const relative = getRelativeFieldObject(field, context.file.data)
    const data = relative?.relative[relative.key]

    if (!isInstanceOfEffect(data)) {
        dispatch.popEditorPage()
        return null
    }

    return (
        <div className={styles.main}>
            <NavigationComponent/>
            <GroupComponent header={<LocalizedText id='editor-header-effect'/>} open>
                <EnumComponent field={`${field}.type`} type='effectType' labelId='editor-type' deps={deps}/>
                <TextComponent field={`${field}.label`} labelId='editor-label' deps={deps}/>
                { data.type === EffectType.Text &&
                    <TextComponent
                        field={`${field}.text`}
                        labelId='editor-text'
                        deps={[...deps, `${field}.type`]}/>
                }
                { data.type === EffectType.Damage &&
                    <>
                        <EnumComponent
                            field={`${field}.damageType`}
                            type='damageType'
                            labelId='editor-damageType'
                            deps={[...deps, `${field}.type`]}/>
                        <EnumComponent
                            field={`${field}.scaling`}
                            type='scaling'
                            labelId='editor-scaling'
                            deps={[...deps, `${field}.type`]}/>
                        <BooleanComponent
                            field={`${field}.proficiency`}
                            labelId='editor-proficiency'
                            deps={[...deps, `${field}.type`]}/>
                        <EnumComponent
                            field={`${field}.die`}
                            type='die'
                            labelId='editor-die'
                            deps={[...deps, `${field}.type`]}/>
                        <NumberComponent
                            field={`${field}.dieCount`}
                            labelId='editor-dieCount'
                            deps={[...deps, `${field}.type`]}/>
                        <CalcComponent
                            field={`${field}.modifier`}
                            labelId='editor-modifier'
                            deps={[...deps, `${field}.type`]}/>

                    </>
                }
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-condition'/>} open>
                <ConditionComponent field={`${field}.condition`} labelId='editor-header-condition' deps={page?.deps}/>
            </GroupComponent>
        </div>
    )
}

export default EffectEditor

import { useContext } from 'react'
import { Context } from 'components/contexts/file'
import GroupComponent from './components/group'
import LocalizedText from 'components/localizedText'
import TextComponent from './components/text'
import EnumComponent from './components/enum'
import NavigationComponent from './components/navigation'
import BooleanComponent from './components/boolean'
import NumberComponent from './components/number'
import CalcComponent from './components/calc'
import ConditionComponent from './components/condition'
import { getRelativeFieldObject } from 'utils'
import { EffectType } from 'structure/database/effect/common'
import { isInstanceOfEffect } from 'structure/database/effect/factory'
import { DieType } from 'structure/dice'
import styles from './style.module.scss'

const EffectEditor: React.FC = () => {
    const [context] = useContext(Context)
    const page = context.editorPages[context.editorPages.length - 1]
    const field = page?.root
    const relative = getRelativeFieldObject(field, context.file.data)
    const data = relative?.relative[relative.key]

    if (!isInstanceOfEffect(data)) {
        return null
    }

    return (
        <div className={styles.main}>
            <NavigationComponent/>
            <GroupComponent header={<LocalizedText id='editor-header-effect'/>} open>
                <EnumComponent field={`${field}.type`} type='effectType' labelId='editor-type' />
                <TextComponent field={`${field}.label`} labelId='editor-label' />
                { data.type === EffectType.Text &&
                    <TextComponent
                        field={`${field}.text`}
                        labelId='editor-text'/>
                }
                { data.type === EffectType.Damage &&
                    <>
                        <EnumComponent
                            field={`${field}.category`}
                            type='effectCategory'
                            labelId='editor-category'/>
                        <EnumComponent
                            field={`${field}.damageType`}
                            type='damageType'
                            labelId='editor-damageType'/>
                        <EnumComponent
                            field={`${field}.scaling`}
                            type='scaling'
                            labelId='editor-scaling'/>
                        <BooleanComponent
                            field={`${field}.proficiency`}
                            labelId='editor-proficiency'/>
                        <EnumComponent
                            field={`${field}.die`}
                            type='die'
                            labelId='editor-die'/>
                        { data.die !== DieType.None &&
                            <NumberComponent
                                field={`${field}.dieCount`}
                                labelId='editor-dieCount'/>
                        }
                        <CalcComponent
                            field={`${field}.modifier`}
                            labelId='editor-modifier'/>

                    </>
                }
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-condition'/>} open>
                <ConditionComponent field={`${field}.condition`} labelId='editor-header-condition' />
            </GroupComponent>
        </div>
    )
}

export default EffectEditor

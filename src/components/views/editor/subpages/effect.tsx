import { useContext } from 'react'
import { Context } from 'components/contexts/file'
import GroupComponent from '../components/group'
import LocalizedText from 'components/controls/localizedText'
import TextComponent from '../components/text'
import EnumComponent from '../components/enum'
import NavigationComponent from '../components/navigation'
import SelectionInputComponent from '../components/selectionInput'
import ConditionComponent from '../components/condition'
import { createField, getRelativeFieldObject } from 'utils'
import { EffectType } from 'structure/database/effect/common'
import { isInstanceOfEffect } from 'structure/database/effect/factory'
import { DieType } from 'structure/dice'
import styles from '../style.module.scss'

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
                }{ data.type === EffectType.Damage &&
                    <>
                        <EnumComponent
                            field={createField(field, 'category')}
                            type='effectCategory'
                            labelId='editor-category'/>
                        <EnumComponent
                            field={createField(field, 'damageType')}
                            type='damageType'
                            labelId='editor-damageType'/>
                        <SelectionInputComponent
                            field={createField(field, 'scaling')}
                            type='number'
                            optionsType='scaling'
                            labelId='editor-scaling'
                            fill/>
                        <EnumComponent
                            field={createField(field, 'die')}
                            type='die'
                            labelId='editor-die'/>
                        { data.die !== DieType.None &&
                            <SelectionInputComponent
                                field={createField(field, 'dieCount')}
                                type='number'
                                optionsType='scaling'
                                labelId='editor-dieCount'
                                fill/>
                        }

                    </>
                }{ data.type === EffectType.Die &&
                    <>
                        <SelectionInputComponent
                            field={createField(field, 'scaling')}
                            type='number'
                            optionsType='scaling'
                            labelId='editor-scaling'
                            fill/>
                        <EnumComponent
                            field={createField(field, 'die')}
                            type='die'
                            labelId='editor-die'/>
                        { data.die !== DieType.None &&
                            <SelectionInputComponent
                                field={createField(field, 'dieCount')}
                                type='number'
                                optionsType='scaling'
                                labelId='editor-dieCount'
                                fill/>
                        }
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

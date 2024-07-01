import { useContext } from 'react'
import { Context, getRelativeFieldObject } from 'components/contexts/file'
import GroupComponent from './components/group'
import LocalizedText from 'components/localizedText'
import EnumComponent from './components/enum'
import NavigationComponent from './components/navigation'
import NumberComponent from './components/number'
import CalcComponent from './components/calc'
import { ScalingModifierType } from 'structure/database/scalingModifier/common'
import { isInstanceOfScalingModifier } from 'structure/database/scalingModifier/factory'
import styles from './style.module.scss'

const ScalingModifierEditor: React.FC = () => {
    const [context, dispatch] = useContext(Context)
    const page = context.editorPages[context.editorPages.length - 1]
    const field = page?.root
    const deps = page?.deps ?? []
    const relative = getRelativeFieldObject(field, context.file.data)
    const data = relative?.relative[relative.key]

    if (!isInstanceOfScalingModifier(data)) {
        dispatch.popEditorPage()
        return null
    }

    return (
        <div className={styles.main}>
            <NavigationComponent/>
            <GroupComponent header={<LocalizedText id='editor-header-effect'/>} open>
                <EnumComponent field={`${field}.type`} type='scalingModifier' labelId='editor-type' deps={deps}/>
                <EnumComponent field={`${field}.scaling`} type='effectScaling' labelId='editor-scaling' deps={deps}/>
                <NumberComponent field={`${field}.value`} labelId='editor-scalingValue' deps={deps}/>
                { data.type === ScalingModifierType.Die &&
                    <EnumComponent
                        field={`${field}.die`}
                        type='die'
                        labelId='editor-die'
                        deps={[...deps, `${field}.type`]}/>
                }
                { data.type === ScalingModifierType.DieCount &&
                    <NumberComponent
                        field={`${field}.dieCount`}
                        labelId='editor-dieCount'
                        deps={[...deps, `${field}.type`]}/>
                }
                { data.type === ScalingModifierType.Modifier &&
                    <CalcComponent
                        field={`${field}.modifier`}
                        labelId='editor-modifier'
                        deps={[...deps, `${field}.type`]}/>
                }
            </GroupComponent>
        </div>
    )
}

export default ScalingModifierEditor

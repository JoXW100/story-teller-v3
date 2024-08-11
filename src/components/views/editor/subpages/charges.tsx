import { useContext } from 'react'
import { Context } from 'components/contexts/file'
import GroupComponent from '../components/group'
import LocalizedText from 'components/controls/localizedText'
import EnumComponent from '../components/enum'
import NavigationComponent from '../components/navigation'
import ConditionComponent from '../components/condition'
import SelectionInputComponent from '../components/selectionInput'
import { createField, getRelativeFieldObject } from 'utils'
import ChargesData from 'structure/database/charges'
import styles from '../style.module.scss'

const ChargesEditor: React.FC = () => {
    const [context] = useContext(Context)
    const page = context.editorPages[context.editorPages.length - 1]
    const field = page?.root
    const relative = getRelativeFieldObject(field, context.file.data)
    const data = relative?.relative[relative.key]

    if (!(data instanceof ChargesData)) {
        return null
    }

    return (
        <div className={styles.main}>
            <NavigationComponent/>
            <GroupComponent header={<LocalizedText id='editor-header-charges'/>} open>
                <EnumComponent
                    field={createField(field, 'chargesReset')}
                    type='restType'
                    labelId='editor-chargesReset' />
                <SelectionInputComponent
                    field={createField(field, 'charges')}
                    type='number'
                    optionsType='scaling'
                    labelId='editor-charges'
                    fill/>
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-condition'/>} open>
                <ConditionComponent
                    field={createField(field, 'conditionValue')}
                    labelId='editor-header-condition' />
            </GroupComponent>
        </div>
    )
}

export default ChargesEditor

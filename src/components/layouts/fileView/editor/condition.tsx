import { useContext } from 'react'
import { Context } from 'components/contexts/file'
import GroupComponent from './components/group'
import LocalizedText from 'components/localizedText'
import { getRelativeFieldObject } from 'utils'
import NavigationComponent from './components/navigation'
import ConditionComponent from './components/condition'
import Condition from 'structure/database/condition'
import styles from './style.module.scss'

const ConditionEditor: React.FC = () => {
    const [context] = useContext(Context)
    const page = context.editorPages[context.editorPages.length - 1]
    const field = page?.root
    const relative = getRelativeFieldObject(field, context.file.data)
    const data = relative?.relative?.[relative.key]

    if (!(data instanceof Condition)) {
        return null
    }

    return (
        <div className={styles.main}>
            <NavigationComponent/>
            <GroupComponent header={<LocalizedText id='editor-header-condition'/>} open>
                <ConditionComponent field={field} labelId='editor-header-condition' />
            </GroupComponent>
        </div>
    )
}

export default ConditionEditor

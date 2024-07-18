import { useContext } from 'react'
import { Context } from 'components/contexts/file'
import GroupComponent from './components/group'
import LocalizedText from 'components/localizedText'
import EnumComponent from './components/enum'
import NavigationComponent from './components/navigation'
import NumberComponent from './components/number'
import ConditionComponent from './components/condition'
import { getRelativeFieldObject } from 'utils'
import ChargesData from 'structure/database/charges'
import styles from './style.module.scss'

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
                <NumberComponent field={`${field}.charges`} labelId='editor-charges' />
                <EnumComponent field={`${field}.chargesReset`} type='restType' labelId='editor-chargesReset' />
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-condition'/>} open>
                <ConditionComponent field={`${field}.condition`} labelId='editor-header-condition' />
            </GroupComponent>
        </div>
    )
}

export default ChargesEditor

import { useContext } from 'react'
import SpellRenderer from './spell'
import { Context } from 'components/contexts/file'
import { EmptyBonusGroup, EmptyProperties } from 'structure/database'
import type { SpellData } from 'structure/database/files/spell/factory'
import styles from '../styles.module.scss'

const SpellDocumentRender: React.FC = () => {
    const [context] = useContext(Context)
    const data = context.file.data as SpellData

    return (
        <div className={styles.rendererBox} data='true'>
            <SpellRenderer
                id={context.file.id}
                data={data}
                properties={EmptyProperties}
                attackBonuses={EmptyBonusGroup}
                damageBonuses={EmptyBonusGroup}/>
        </div>
    )
}

export default SpellDocumentRender

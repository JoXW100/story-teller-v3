import LinkRenderer from './spell'
import type { LinkRendererProps } from '..'
import SpellDocument from 'structure/database/files/spell'
import { EmptyBonusGroup, EmptyProperties } from 'structure/database'

const SpellLinkRenderer: React.FC<LinkRendererProps> = ({ file }) => {
    if (file instanceof SpellDocument) {
        return (
            <LinkRenderer
                data={file.data}
                properties={EmptyProperties}
                attackBonuses={EmptyBonusGroup}
                damageBonuses={EmptyBonusGroup}/>
        )
    }
    return null
}

export default SpellLinkRenderer

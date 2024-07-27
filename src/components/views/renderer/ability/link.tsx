import AbilityDocument from 'structure/database/files/ability'
import { AbilityRenderer } from '.'
import type { LinkRendererProps } from '..'

const AbilityLinkRenderer: React.FC<LinkRendererProps> = ({ file }) => {
    if (file instanceof AbilityDocument) {
        return <AbilityRenderer data={file.data} open/>
    }
    return null
}

export default AbilityLinkRenderer

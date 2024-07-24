import { AbilityRenderer } from '.'
import type { AbilityData } from 'structure/database/files/ability/factory'
import type { ObjectId } from 'types'

type AbilityLinkRendererProps = React.PropsWithRef<{
    id: ObjectId
    data: AbilityData
}>

const AbilityLinkRenderer: React.FC<AbilityLinkRendererProps> = ({ id, data }) => {
    return <AbilityRenderer id={id} data={data} open/>
}

export default AbilityLinkRenderer

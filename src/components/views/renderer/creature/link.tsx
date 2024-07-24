import Elements, { ElementDictionary } from 'components/elements'
import { useMemo } from 'react'
import type CreatureData from 'structure/database/files/creature/data'
import StoryScript from 'structure/language/storyscript'
import type { ObjectId } from 'types'

type CreatureLinkRendererProps = React.PropsWithRef<{
    id: ObjectId
    data: CreatureData
}>

const CreatureLinkRenderer: React.FC<CreatureLinkRendererProps> = ({ id, data }) => {
    const descriptionToken = useMemo(() => StoryScript.tokenize(ElementDictionary, data.description).root, [data.description])
    return (
        <Elements.align direction='h' weight='1' width='100%'>
            <div className='no-line-break' style={{ width: '120px', height: '120px' }}>
                <Elements.image href={data.portrait} border={false} weight={null} width='100%'/>
            </div>
            <Elements.line width='2px'/>
            <Elements.block weight='1' width={null}>
                <Elements.h3 underline={false}>
                    { data.name }
                </Elements.h3>
                { descriptionToken.build() }
            </Elements.block>
        </Elements.align>
    )
}

export default CreatureLinkRenderer

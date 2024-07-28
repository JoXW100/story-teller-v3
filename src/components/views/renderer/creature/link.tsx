import { useMemo } from 'react'
import type { LinkRendererProps } from '..'
import Elements, { ElementDictionary } from 'components/elements'
import CreatureData from 'structure/database/files/creature/data'

const CreatureLinkRenderer: React.FC<LinkRendererProps> = ({ file }) => {
    const descriptionToken = useMemo(() => {
        if (file?.data instanceof CreatureData) {
            return file.getTokenizedDescription(ElementDictionary)
        }
        return null
    }, [file])

    if (descriptionToken === null) {
        return null
    }

    return (
        <Elements.align direction='h' weight='1' width='100%'>
            <div className='no-line-break' style={{ width: '100px', height: '100px' }}>
                <Elements.image href={file.data.portrait} border={false} weight={null} width='100%'/>
            </div>
            <Elements.line width='2px'/>
            <Elements.block weight='1' width={null}>
                <Elements.h3 underline={false}>
                    { file.data.name }
                </Elements.h3>
                { descriptionToken.build() }
            </Elements.block>
        </Elements.align>
    )
}

export default CreatureLinkRenderer

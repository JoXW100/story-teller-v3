import { useMemo } from 'react'
import type { LinkRendererProps } from '.'
import Elements, { ElementDictionary } from 'components/elements'
import CreatureData from 'structure/database/files/creature/data'
import NPCData from 'structure/database/files/npc/data'
import { Tooltip } from '@mui/material'

const PortraitLinkRenderer: React.FC<LinkRendererProps> = ({ file }) => {
    const descriptionToken = useMemo(() => {
        if (file.data instanceof CreatureData || file.data instanceof NPCData) {
            return file.getTokenizedDescription(ElementDictionary)
        }
        return null
    }, [file])

    if (descriptionToken === null) {
        return null
    }

    return (
        <Elements.align direction='h' weight={null} width={null}>
            <Tooltip title={<Elements.image href={file.data.portrait} border weight={null} width={null}/>}>
                <div className='no-line-break square'>
                    <Elements.image href={file.data.portrait} border={false} weight={null} width='100px'/>
                </div>
            </Tooltip>
            <Elements.space/>
            <Elements.block weight='1' width={null}>
                <Elements.h3 underline={false}>
                    { file.data.name }
                </Elements.h3>
                { descriptionToken.build() }
            </Elements.block>
        </Elements.align>
    )
}

export default PortraitLinkRenderer

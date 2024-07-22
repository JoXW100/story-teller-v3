import { useState, useContext } from 'react'
import ZoomInIcon from '@mui/icons-material/ZoomInSharp'
import ZoomOutIcon from '@mui/icons-material/ZoomOutSharp'
import { Tooltip } from '@mui/material'
import TextDocumentRenderer from './text'
import CreatureDocumentRenderer from './creature'
import CreatureLinkRenderer from './creature/link'
import CharacterDocumentRenderer from './character'
import AbilityDocumentRenderer from './ability'
import AbilityLinkRenderer from './ability/link'
import SpellDocumentRender from './spell'
import RaceDocumentRenderer from './race'
import ItemDocumentRenderer from './item'
import MapDocumentRenderer from './map'
import DefaultRenderer from './default'
import { isKeyOf } from 'utils'
import { Context } from 'components/contexts/file'
import LocalizedText from 'components/localizedText'
import Loading from 'components/loading'
import { DocumentType } from 'structure/database'
import type { ObjectId } from 'types'
import styles from './styles.module.scss'

export const DocumentRendererMap = {
    [DocumentType.Ability]: { document: AbilityDocumentRenderer, link: AbilityLinkRenderer },
    [DocumentType.Character]: { document: CharacterDocumentRenderer, link: CreatureLinkRenderer },
    [DocumentType.Class]: { document: DefaultRenderer, link: DefaultRenderer },
    [DocumentType.Subclass]: { document: DefaultRenderer, link: DefaultRenderer },
    [DocumentType.Creature]: { document: CreatureDocumentRenderer, link: CreatureLinkRenderer },
    [DocumentType.Item]: { document: ItemDocumentRenderer, link: CreatureLinkRenderer },
    [DocumentType.Map]: { document: MapDocumentRenderer, link: DefaultRenderer },
    [DocumentType.Modifier]: { document: DefaultRenderer, link: DefaultRenderer },
    [DocumentType.Race]: { document: RaceDocumentRenderer, link: DefaultRenderer },
    [DocumentType.Subrace]: { document: DefaultRenderer, link: DefaultRenderer },
    [DocumentType.Spell]: { document: SpellDocumentRender, link: DefaultRenderer },
    [DocumentType.Text]: { document: TextDocumentRenderer, link: DefaultRenderer }
} satisfies Record<DocumentType, { document: React.FC, link: React.FC<{ id: ObjectId, data: any }> }>

const zoomDelta: number = 10

const Renderer: React.FC = () => {
    const [context] = useContext(Context)
    const [zoom, setZoom] = useState(100)
    const Renderer = isKeyOf(context.file.type, DocumentRendererMap)
        ? DocumentRendererMap[context.file.type].document
        : () => null

    const changeZoom = (delta: number): void => {
        setZoom((val) => Math.min(Math.max(val + delta, 10), 400))
    }

    return (
        <div className={styles.main}>
            <div className={styles.menu}>
                <div>
                    <span>{`${zoom}%`}</span>
                    <Tooltip placement='right' title={<LocalizedText id='renderer-zoomIn'/>}>
                        <button onClick={() => { changeZoom(zoomDelta) }}>
                            <ZoomInIcon/>
                        </button>
                    </Tooltip>
                    <Tooltip placement='right' title={<LocalizedText id='renderer-zoomOut'/>}>
                        <button onClick={() => { changeZoom(-zoomDelta) }}>
                            <ZoomOutIcon/>
                        </button>
                    </Tooltip>
                </div>
            </div>
            <div className={styles.innerPage} style={{ zoom: `${zoom}%` }}>
                <Loading loaded={!context.loading}>
                    <div className={styles.contentHolder}>
                        <Renderer/>
                    </div>
                </Loading>
            </div>
        </div>
    )
}

export default Renderer

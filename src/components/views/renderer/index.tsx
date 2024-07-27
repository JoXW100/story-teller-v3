import { useState, useContext } from 'react'
import ZoomInIcon from '@mui/icons-material/ZoomInSharp'
import ZoomOutIcon from '@mui/icons-material/ZoomOutSharp'
import { Tooltip } from '@mui/material'
import { DefaultRenderer, DefaultLinkRenderer } from './default'
import TextDocumentRenderer from './text'
import CreatureDocumentRenderer from './creature'
import CreatureLinkRenderer from './creature/link'
import CharacterDocumentRenderer from './character'
import EncounterDocumentRenderer from './encounter'
import AbilityDocumentRenderer from './ability'
import AbilityLinkRenderer from './ability/link'
import SpellDocumentRender from './spell'
import RaceDocumentRenderer from './race'
import SubraceDocumentRenderer from './subrace'
import ItemDocumentRenderer from './item'
import MapDocumentRenderer from './map'
import ClassRenderer from './class'
import SubclassRenderer from './subclass'
import { isKeyOf } from 'utils'
import { Context } from 'components/contexts/file'
import LocalizedText from 'components/controls/localizedText'
import Loading from 'components/controls/loading'
import { DocumentType } from 'structure/database'
import type DatabaseFile from 'structure/database/files'
import styles from './styles.module.scss'

export type LinkRendererProps = React.PropsWithRef<{ file: DatabaseFile }>

export const DocumentRendererMap = {
    [DocumentType.Ability]: { document: AbilityDocumentRenderer, link: AbilityLinkRenderer },
    [DocumentType.Character]: { document: CharacterDocumentRenderer, link: CreatureLinkRenderer },
    [DocumentType.Class]: { document: ClassRenderer, link: DefaultLinkRenderer },
    [DocumentType.Subclass]: { document: SubclassRenderer, link: DefaultLinkRenderer },
    [DocumentType.Creature]: { document: CreatureDocumentRenderer, link: CreatureLinkRenderer },
    [DocumentType.Encounter]: { document: EncounterDocumentRenderer, link: DefaultLinkRenderer },
    [DocumentType.Item]: { document: ItemDocumentRenderer, link: DefaultLinkRenderer },
    [DocumentType.Map]: { document: MapDocumentRenderer, link: DefaultLinkRenderer },
    [DocumentType.Modifier]: { document: DefaultRenderer, link: DefaultLinkRenderer },
    [DocumentType.Race]: { document: RaceDocumentRenderer, link: DefaultLinkRenderer },
    [DocumentType.Subrace]: { document: SubraceDocumentRenderer, link: DefaultLinkRenderer },
    [DocumentType.Spell]: { document: SpellDocumentRender, link: DefaultLinkRenderer },
    [DocumentType.Text]: { document: TextDocumentRenderer, link: DefaultLinkRenderer }
} satisfies Record<DocumentType, { document: React.FC, link: React.FC<LinkRendererProps> }>

const zoomDelta: number = 10

const Renderer: React.FC = () => {
    const [context] = useContext(Context)
    const [zoom, setZoom] = useState(100)
    const Renderer = isKeyOf(context.file.type, DocumentRendererMap)
        ? DocumentRendererMap[context.file.type].document
        : () => { return null }

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

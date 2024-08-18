import { DefaultRenderer, DefaultLinkRenderer } from './default'
import TextDocumentRenderer from './text'
import CreatureDocumentRenderer from './creature'
import PortraitLinkRenderer from './portraitLink'
import CharacterDocumentRenderer from './character'
import EncounterDocumentRenderer from './encounter'
import AbilityDocumentRenderer from './ability'
import AbilityLinkRenderer from './ability/link'
import SpellDocumentRender from './spell'
import SpellLinkRenderer from './spell/link'
import RaceDocumentRenderer from './race'
import SubraceDocumentRenderer from './subrace'
import ItemDocumentRenderer from './item'
import MapDocumentRenderer from './map'
import NPCDocumentRenderer from './npc'
import ClassRenderer from './class'
import SubclassRenderer from './subclass'
import { isKeyOf } from 'utils'
import { type DocumentFileType, DocumentType } from 'structure/database'
import type { Document } from 'types/database/files/factory'

export type LinkRendererProps = React.PropsWithRef<{ file: Document }>

export const DocumentRendererMap: Record<DocumentType, { document: React.FC, link: React.FC<LinkRendererProps> }> = {
    [DocumentType.Ability]: { document: AbilityDocumentRenderer, link: AbilityLinkRenderer },
    [DocumentType.Character]: { document: CharacterDocumentRenderer, link: PortraitLinkRenderer },
    [DocumentType.Class]: { document: ClassRenderer, link: DefaultLinkRenderer },
    [DocumentType.Condition]: { document: DefaultRenderer, link: DefaultLinkRenderer },
    [DocumentType.Subclass]: { document: SubclassRenderer, link: DefaultLinkRenderer },
    [DocumentType.Creature]: { document: CreatureDocumentRenderer, link: PortraitLinkRenderer },
    [DocumentType.Encounter]: { document: EncounterDocumentRenderer, link: DefaultLinkRenderer },
    [DocumentType.Item]: { document: ItemDocumentRenderer, link: DefaultLinkRenderer },
    [DocumentType.Map]: { document: MapDocumentRenderer, link: DefaultLinkRenderer },
    [DocumentType.Modifier]: { document: DefaultRenderer, link: DefaultLinkRenderer },
    [DocumentType.NPC]: { document: NPCDocumentRenderer, link: PortraitLinkRenderer },
    [DocumentType.Race]: { document: RaceDocumentRenderer, link: DefaultLinkRenderer },
    [DocumentType.Subrace]: { document: SubraceDocumentRenderer, link: DefaultLinkRenderer },
    [DocumentType.Spell]: { document: SpellDocumentRender, link: SpellLinkRenderer },
    [DocumentType.Text]: { document: TextDocumentRenderer, link: DefaultLinkRenderer }
}

type DocumentRendererProps = React.PropsWithRef<{
    type: DocumentFileType
}>
export const DocumentRenderer: React.FC<DocumentRendererProps> = ({ type }) => {
    if (isKeyOf(type, DocumentRendererMap)) {
        const Component = DocumentRendererMap[type].document
        return <Component/>
    }
    return <DefaultRenderer/>
}

export const LinkRenderer: React.FC<LinkRendererProps> = ({ file }) => {
    if (isKeyOf(file.type, DocumentRendererMap)) {
        const Component = DocumentRendererMap[file.type].link
        return <Component file={file}/>
    }
    return <DefaultLinkRenderer/>
}

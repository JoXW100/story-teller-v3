import { useContext, useEffect, useMemo } from 'react'
import TextDocumentEditor from './text'
import CreatureDocumentEditor from './creature'
import CharacterDocumentEditor from './character'
import ClassDocumentEditor from './class'
import ClassLevelEditor from './classLevel'
import AbilityDocumentEditor from './ability'
import ItemDocumentEditor from './item'
import MapDocumentEditor from './map'
import ModifierDocumentEditor from './modifier'
import RaceDocumentEditor from './race'
import SubraceDocumentEditor from './subrace'
import SpellDocumentEditor from './spell'
import SubclassDocumentEditor from './subclass'
import EffectEditor from './effect'
import ConditionEditor from './condition'
import ChargesEditor from './charges'
import EncounterDocumentEditor from './encounter'
import NPCDocumentEditor from './npc'
import { Context } from 'components/contexts/file'
import { isKeyOf } from 'utils'
import { DocumentType } from 'structure/database'

export const DocumentEditorMap = {
    [DocumentType.Ability]: AbilityDocumentEditor,
    [DocumentType.Creature]: CreatureDocumentEditor,
    [DocumentType.Character]: CharacterDocumentEditor,
    [DocumentType.Class]: ClassDocumentEditor,
    [DocumentType.Encounter]: EncounterDocumentEditor,
    [DocumentType.Item]: ItemDocumentEditor,
    [DocumentType.Map]: MapDocumentEditor,
    [DocumentType.Modifier]: ModifierDocumentEditor,
    [DocumentType.NPC]: NPCDocumentEditor,
    [DocumentType.Race]: RaceDocumentEditor,
    [DocumentType.Subrace]: SubraceDocumentEditor,
    [DocumentType.Spell]: SpellDocumentEditor,
    [DocumentType.Subclass]: SubclassDocumentEditor,
    [DocumentType.Text]: TextDocumentEditor,
    'classLevel': ClassLevelEditor,
    'effect': EffectEditor,
    'conditionInner': ConditionEditor,
    'condition': ConditionEditor,
    'charges': ChargesEditor,
    'none': null
}

export type EditorPageKeyType = keyof typeof DocumentEditorMap

const Editor: React.FC = () => {
    const [context, dispatch] = useContext(Context)
    const title = useMemo(() => context.file.getTitle(), [context.file])
    const key = useMemo(() => context.editorPages[context.editorPages.length - 1]?.pageKey ?? 'none', [context.editorPages])

    useEffect(() => {
        dispatch.setEditorPage({
            pageKey: isKeyOf(context.file.type, DocumentEditorMap) ? context.file.type : 'none',
            root: 'data',
            name: title
        })
    }, [context.file.type, title, dispatch])

    const Component = DocumentEditorMap[key] ?? DocumentEditorMap[context.file.type as keyof typeof DocumentEditorMap] ?? (() => null)
    return <Component/>
}

export default Editor

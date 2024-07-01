import { useContext, useEffect, useMemo } from 'react'
import TextDocumentEditor from './text'
import CreatureDocumentEditor from './creature'
import CharacterDocumentEditor from './character'
import ClassDocumentEditor from './class'
import ClassLevelEditor from './classLevel'
import AbilityDocumentEditor from './ability'
import SpellDocumentEditor from './spell'
import RaceDocumentEditor from './race'
import MapDocumentEditor from './map'
import ModifierDocumentEditor from './modifier'
import EffectEditor from './effect'
import ScalingModifierEditor from './scalingModifier'
import InnerModifierEditor from './innerModifier'
import ConditionEditor from './condition'
import { Context } from 'components/contexts/file'
import { isKeyOf } from 'utils'
import { DocumentType } from 'structure/database'

export const DocumentEditorMap = {
    [DocumentType.Ability]: AbilityDocumentEditor,
    [DocumentType.Creature]: CreatureDocumentEditor,
    [DocumentType.Character]: CharacterDocumentEditor,
    [DocumentType.Class]: ClassDocumentEditor,
    [DocumentType.Map]: MapDocumentEditor,
    [DocumentType.Modifier]: ModifierDocumentEditor,
    [DocumentType.Race]: RaceDocumentEditor,
    [DocumentType.Spell]: SpellDocumentEditor,
    [DocumentType.Text]: TextDocumentEditor,
    'classLevel': ClassLevelEditor,
    'effect': EffectEditor,
    'scalingModifier': ScalingModifierEditor,
    'innerModifier': InnerModifierEditor,
    'condition': ConditionEditor,
    'none': () => null
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
            name: title,
            deps: []
        })
    }, [context.file.type, title, dispatch])

    const Component = DocumentEditorMap[key]
    return <Component/>
}

export default Editor

import { useContext, useState } from 'react'
import MEditor from '@monaco-editor/react'
import { ElementDictionary } from '../elements'
import { Context } from '../contexts/app'
import StoryScript from 'structure/language/storyscript'
import type { MonacoEditor, MonacoType, IToken, TokenContext } from 'types/language'

type TextEditorProps = React.PropsWithRef<{
    value?: string
    script?: StoryScript
    className?: string
    context?: TokenContext
    onMount?: (token: IToken | null) => void
    onChange?: (value: string, token: IToken | null) => void
}>

interface TextEditorState {
    script: StoryScript
    editor: MonacoEditor | null
    monaco: MonacoType | null
}

const TextEditor: React.FC<TextEditorProps> = ({ value, script = new StoryScript(ElementDictionary), className, context, onMount, onChange }) => {
    const [app] = useContext(Context)
    const [state, setState] = useState<TextEditorState>({
        script: script,
        editor: null,
        monaco: null
    })

    return (
        <MEditor
            value={value}
            language='storyscript'
            theme='storyscript-default'
            className={className}
            options={{
                minimap: { enabled: false },
                wordWrap: app.enableEditorWordWrap ? 'on' : 'off',
                suggest: { showWords: false },
                automaticLayout: true,
                scrollbar: {
                    alwaysConsumeMouseWheel: false
                }
            }}
            beforeMount={(monaco) => {
                state.script.register(monaco)
            }}
            onMount={(editor, monaco) => {
                const token = state.script.applyMarkers(editor, monaco, undefined, context)
                editor.layout()
                setState(state => ({ ...state, editor: editor, monaco: monaco }))
                onMount?.(token)
            }}
            onChange={(text) => {
                if (state.editor !== null && state.monaco !== null) {
                    const token = state.script.applyMarkers(state.editor, state.monaco, undefined, context)
                    onChange?.(text ?? '', token)
                }
            }}/>
    )
}

export default TextEditor

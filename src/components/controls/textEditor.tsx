import { useContext, useState } from 'react'
import EditIcon from '@mui/icons-material/EditSharp'
import AlignIcon from '@mui/icons-material/AlignHorizontalLeftSharp'
import BoxIcon from '@mui/icons-material/CheckBoxOutlineBlankSharp'
import CutIcon from '@mui/icons-material/ContentCutSharp'
import CopyIcon from '@mui/icons-material/ContentCopySharp'
import PasteIcon from '@mui/icons-material/ContentPasteSharp'
import BlockIcon from '@mui/icons-material/GridViewSharp'
import BoldIcon from '@mui/icons-material/FormatBoldSharp'
import TableIcon from '@mui/icons-material/TableChartSharp'
import LinkIcon from '@mui/icons-material/InsertLinkSharp'
import LayoutIcon from '@mui/icons-material/DashboardSharp'
import InteractiveIcon from '@mui/icons-material/TouchAppSharp'
import CenterIcon from '@mui/icons-material/FilterCenterFocusSharp'
import DiceIcon from '@mui/icons-material/CasinoSharp'
import LineIcon from '@mui/icons-material/HorizontalRuleSharp'
import SpaceIcon from '@mui/icons-material/SpaceBarSharp'
import IconIcon from '@mui/icons-material/InsertEmoticonSharp'
import ImageIcon from '@mui/icons-material/InsertPhotoSharp'
import TextIcon from '@mui/icons-material/TextFieldsSharp'
import MEditor from '@monaco-editor/react'
import { ElementDictionary } from '../elements'
import { Context } from '../contexts/app'
import StoryScript from 'structure/language/storyscript'
import type { MonacoEditor, MonacoType, IToken, TokenContext, MonacoMouseEvent } from 'types/language'
import { openContext } from './contextMenu'

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

    const handleContextMenu = (editor: MonacoEditor, e: MonacoMouseEvent): void => {
        const model = editor.getModel()
        const range = e.target.range
        const selectionText = model !== null && range !== null ? model.getValueInRange(range) : ''

        const insertText = (value: string): void => {
            editor.executeEdits('editor-context', [{
                range: range!,
                text: value
            }])
        }

        openContext([
            {
                text: 'textEditor-insert',
                icon: <EditIcon/>,
                content: [
                    {
                        text: 'textEditor-insert-layout',
                        icon: <LayoutIcon/>,
                        content: [
                            {
                                text: 'textEditor-insert-layout-align',
                                icon: <AlignIcon/>,
                                action: () => { insertText(`\\align[hc] {${selectionText}}`) }
                            },
                            {
                                text: 'textEditor-insert-layout-block',
                                icon: <BlockIcon/>,
                                action: () => { insertText(`\\block {${selectionText}}`) }
                            },
                            {
                                text: 'textEditor-insert-layout-table',
                                icon: <TableIcon/>,
                                action: () => { insertText(`\\table {\n\t\\th{ Header }\n\t\\tc{${selectionText}}\n}`) }
                            },
                            {
                                text: 'textEditor-insert-layout-box',
                                icon: <BoxIcon/>,
                                action: () => { insertText(`\\box {${selectionText}}`) }
                            },
                            {
                                text: 'textEditor-insert-layout-center',
                                icon: <CenterIcon/>,
                                action: () => { insertText(`\\center {${selectionText}}`) }
                            },
                            {
                                text: 'textEditor-insert-layout-line',
                                icon: <LineIcon/>,
                                action: () => { insertText('\\line') }
                            },
                            {
                                text: 'textEditor-insert-layout-space',
                                icon: <SpaceIcon/>,
                                action: () => { insertText('\\space') }
                            }
                        ]
                    },
                    {
                        text: 'textEditor-insert-decoration',
                        icon: <ImageIcon/>,
                        content: [
                            {
                                text: 'textEditor-insert-decoration-bold',
                                icon: <BoldIcon/>,
                                action: () => { insertText(`\\bold {${selectionText}}`) }
                            },
                            {
                                text: 'textEditor-insert-decoration-h1',
                                icon: <TextIcon/>,
                                action: () => { insertText(`\\h1 {${selectionText}}`) }
                            },
                            {
                                text: 'textEditor-insert-decoration-h2',
                                icon: <TextIcon/>,
                                action: () => { insertText(`\\h2 {${selectionText}}`) }
                            },
                            {
                                text: 'textEditor-insert-decoration-h3',
                                icon: <TextIcon/>,
                                action: () => { insertText(`\\h3 {${selectionText}}`) }
                            },
                            {
                                text: 'textEditor-insert-decoration-h4',
                                icon: <TextIcon/>,
                                action: () => { insertText(`\\h4 {${selectionText}}`) }
                            },
                            {
                                text: 'textEditor-insert-decoration-icon',
                                icon: <IconIcon/>,
                                action: () => { insertText('\\icon[acid, tooltips: Acid]') }
                            },
                            {
                                text: 'textEditor-insert-decoration-image',
                                icon: <ImageIcon/>,
                                action: () => { insertText('\\image[]') }
                            }
                        ]
                    },
                    {
                        text: 'textEditor-insert-interactive',
                        icon: <InteractiveIcon/>,
                        content: [
                            {
                                text: 'textEditor-insert-interactive-link',
                                icon: <LinkIcon/>,
                                action: () => { insertText(`\\link[] {${selectionText}}`) }
                            },
                            {
                                text: 'textEditor-insert-interactive-linkTitle',
                                icon: <LinkIcon/>,
                                action: () => { insertText('\\linkTitle[]') }
                            },
                            {
                                text: 'textEditor-insert-interactive-linkContent',
                                icon: <LinkIcon/>,
                                action: () => { insertText('\\linkContent[]') }
                            },
                            {
                                text: 'textEditor-insert-interactive-roll',
                                icon: <DiceIcon/>,
                                action: () => { insertText(`\\roll[1d20+0, type: general, mode: normal, desc: Rolled, tooltips: Roll] {${selectionText}}`) }
                            },
                            {
                                text: 'textEditor-insert-interactive-save',
                                icon: <DiceIcon/>,
                                action: () => { insertText('\\save[10, type: type, tooltips: ...]') }
                            },
                            {
                                text: 'textEditor-insert-interactive-check',
                                icon: <DiceIcon/>,
                                action: () => { insertText('\\check[10, type: type, tooltips: ...]') }
                            }
                        ]
                    }
                ]
            },
            {
                text: 'textEditor-cut',
                icon: <CutIcon/>,
                disabled: selectionText.length <= 0,
                action: () => { void Promise.resolve(navigator.clipboard.writeText(selectionText)).then(() => { insertText('') }) }
            },
            {
                text: 'textEditor-copy',
                icon: <CopyIcon/>,
                disabled: selectionText.length <= 0,
                action: () => { void Promise.resolve(navigator.clipboard.writeText(selectionText)) }
            },
            {
                text: 'textEditor-paste',
                icon: <PasteIcon/>,
                action: () => { void Promise.resolve(navigator.clipboard.readText().then((res) => { insertText(res) })) }
            }
        ], { x: e.event.posx, y: e.event.posy }, true)
    }

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
                },
                contextmenu: false
            }}
            beforeMount={(monaco) => {
                state.script.register(monaco)
            }}
            onMount={(editor, monaco) => {
                state.script.applyMarkers(editor, monaco, undefined, context)
                editor.onContextMenu((e) => {
                    e.event.preventDefault()
                    handleContextMenu(editor, e)
                })
                editor.layout()
                setState(state => ({ ...state, editor: editor, monaco: monaco }))
                onMount?.(state.script.token)
            }}
            onChange={(text) => {
                if (state.editor !== null && state.monaco !== null) {
                    state.script.applyMarkers(state.editor, state.monaco, undefined, context)
                    onChange?.(text ?? '', state.script.token)
                }
            }}/>
    )
}

export default TextEditor

import { useContext } from 'react'
import Tooltip from '@mui/material/Tooltip'
import TextEditor from 'components/textEditor'
import { Context } from 'components/contexts/file'
import GroupComponent from './components/group'
import LocalizedText from 'components/localizedText'
import TextComponent from './components/text'
import NumberComponent from './components/number'
import { ElementDictionary } from 'components/elements'
import { keysOf } from 'utils'
import MapTiles, { type MapTileType } from 'assets/tiles'
import MapDocument from 'structure/database/files/map'
import styles from './style.module.scss'

const MapDocumentEditor: React.FC = () => {
    const [context, dispatch] = useContext(Context)

    if (!(context.file instanceof MapDocument)) {
        return null
    }

    const [descriptionContext] = context.file.data.createContexts(ElementDictionary)

    return (
        <div className={styles.main}>
            <GroupComponent header={<LocalizedText id='editor-header-data'/>} open>
                <TextComponent field='name' labelId='editor-name'/>
                <NumberComponent field='sizeX' labelId='editor-sizeX'/>
                <NumberComponent field='sizeY' labelId='editor-sizeY'/>
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-palette'/>} open>
                <div className={styles.paletteGrid}>
                    { keysOf(MapTiles).map((tile) => <PaletteItem key={tile} type={tile}/>)}
                </div>
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-description'/>} open fill>
                <TextEditor
                    value={context.file.data.description}
                    className={styles.editTextEditor}
                    context={descriptionContext}
                    onMount={(token) => { dispatch.setToken('description', token) }}
                    onChange={(text, token) => {
                        dispatch.setData('description', text)
                        dispatch.setToken('description', token)
                    }}/>
            </GroupComponent>
        </div>
    )
}

type PaletteItemProps = React.PropsWithRef<{
    type: MapTileType
}>

const PaletteItem: React.FC<PaletteItemProps> = ({ type }) => {
    const Icon = MapTiles[type]

    const handleDragStart = (): void => {
        window.dragData = { value: type }
    }

    return (
        <div onDragStart={handleDragStart} draggable>
            <Tooltip title={<LocalizedText id={`editor-palette-${type}`}/>}>
                <span>
                    <Icon className='fill icon square'/>
                </span>
            </Tooltip>
        </div>
    )
}

export default MapDocumentEditor

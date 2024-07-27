import { useContext, useMemo, useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
import MapTiles from 'assets/tiles'
import { Context } from 'components/contexts/file'
import Elements, { ElementDictionary } from 'components/elements'
import { asBooleanString, isKeyOf } from 'utils'
import MapDocument from 'structure/database/files/map'
import { createTile } from 'structure/database/files/map/storage'
import styles from './styles.module.scss'

const MapDocumentRenderer: React.FC = () => {
    const [context] = useContext(Context)
    const descriptionToken = useMemo(() => {
        return context.file.getTokenizedDescription(ElementDictionary)
    }, [context.file])

    if (!(context.file instanceof MapDocument)) {
        return null
    }

    const file = context.file

    return <>
        <Elements.h1 underline>{file.getTitle()}</Elements.h1>
        { !descriptionToken.isEmpty &&
            <>
                {descriptionToken.build()}
                <Elements.line width='2px'/>
            </>
        }

        <div className={styles.map} style={{ gridTemplateColumns: '1fr '.repeat(file.data.sizeX) }}>
            { Array.from({ length: file.data.sizeX * file.data.sizeY }).map((_, index) => (
                <MapTile key={index} index={index}/>
            ))}
        </div>
    </>
}

type MapTileProps = React.PropsWithRef<{
    index: number
}>

const MapTile: React.FC<MapTileProps> = ({ index }) => {
    const [context, dispatch] = useContext(Context)
    const [highlight, setHighlight] = useState(false)
    const file = context.file as MapDocument
    const tile = file.storage.tiles[index] ?? createTile()
    const Icon = MapTiles[tile.type]

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
        e.stopPropagation()
        const value = window.dragData?.value
        if (isKeyOf(value, MapTiles)) {
            e.preventDefault()
        }
    }

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>): void => {
        const value = window.dragData?.value
        if (isKeyOf(value, MapTiles)) {
            e.preventDefault()
            window.dragData.target = index
            setHighlight(true)
        }
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
        const value = window.dragData?.value
        if (isKeyOf(value, MapTiles)) {
            e.preventDefault()
            setHighlight(false)
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
        const value = window.dragData?.value
        if (isKeyOf(value, MapTiles)) {
            e.preventDefault()
            e.stopPropagation()
            setHighlight(false)
            window.dragData.target = null
            dispatch.setStorage('tiles', { ...file.storage.tiles, [index]: createTile({ type: value }) })
        }
    }

    return (
        <div
            className='square center-flex'
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            data={asBooleanString(highlight)}>
            <Tooltip title={tile.type}>
                <span className='fill'>
                    <Icon className='fill square'/>
                </span>
            </Tooltip>
        </div>
    )
}

export default MapDocumentRenderer

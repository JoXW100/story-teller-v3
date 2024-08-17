import { useState, useContext } from 'react'
import ZoomInIcon from '@mui/icons-material/ZoomInSharp'
import ZoomOutIcon from '@mui/icons-material/ZoomOutSharp'
import { Tooltip } from '@mui/material'
import { Context } from 'components/contexts/file'
import LocalizedText from 'components/controls/localizedText'
import Loading from 'components/controls/loading'
import { DocumentRenderer } from './utils'
import styles from './styles.module.scss'

const zoomDelta: number = 10

const Renderer: React.FC = () => {
    const [context] = useContext(Context)
    const [zoom, setZoom] = useState(100)
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
                        <DocumentRenderer type={context.file.type}/>
                    </div>
                </Loading>
            </div>
        </div>
    )
}

export default Renderer

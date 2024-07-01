import { useContext } from 'react'
import FileFilterMenu from './fileFilterMenu'
import FileMenuHeader from './fileMenuHeader'
import FileMenu from './fileMenu'
import { Context } from 'components/layouts/fileSystem/context'
import styles from './style.module.scss'

const FileSystemMenu: React.FC = () => {
    const [context] = useContext(Context)
    return (
        <div className={styles.main}>
            <FileMenuHeader/>
            <FileMenu/>
            { context.showFilterMenu && <FileFilterMenu/> }
        </div>
    )
}

export default FileSystemMenu

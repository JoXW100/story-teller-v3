import FileSystemContext from 'components/layouts/fileSystem/context'
import FileSystemMenu from './menu'

const FileSystem: React.FC = () => {
    return (
        <FileSystemContext>
            <FileSystemMenu/>
        </FileSystemContext>
    )
}

export default FileSystem

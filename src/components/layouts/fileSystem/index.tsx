import FileSystemContext from 'components/layouts/fileSystem/context'
import FileSystemMenu from './menu'
import type { ObjectId } from 'types'

type FileSystemProps = React.PropsWithRef<{
    fileId: ObjectId | null
}>

const FileSystem: React.FC<FileSystemProps> = ({ fileId = null }) => {
    return (
        <FileSystemContext fileId={fileId}>
            <FileSystemMenu/>
        </FileSystemContext>
    )
}

export default FileSystem

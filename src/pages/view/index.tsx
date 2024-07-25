import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Loading from 'components/controls/loading'
import ViewView from 'components/views/view'
import { isObjectId, isObjectIdOrNull } from 'utils'
import { useValidation } from 'utils/hooks/validation'
import Navigation from 'utils/navigation'
import type { ObjectId } from 'types'

interface ViewPageProps {
    fileId?: string
}

const ViewPage: React.FC<{ props: ViewPageProps }> = ({ props }) => {
    const router = useRouter()
    const validated = useValidation()
    const fileId = props.fileId ?? null

    useEffect(() => {
        if (!isObjectIdOrNull(fileId)) {
            void router.push(Navigation.homeURL())
        }
    }, [props, fileId, router])

    return (
        <Loading loaded={validated && isObjectId(fileId)}>
            <ViewView fileId={fileId as ObjectId}/>
        </Loading>
    )
}

export default ViewPage

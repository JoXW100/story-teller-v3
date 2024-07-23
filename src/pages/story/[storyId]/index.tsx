import { useEffect } from 'react'
import { useRouter } from 'next/router'
import StoryView from 'views/story'
import Loading from 'components/loading'
import StoryContext from 'components/contexts/story'
import { asObjectId, isObjectId, isObjectIdOrNull } from 'utils'
import Navigation from 'utils/navigation'
import { useValidation } from 'utils/hooks/validation'
import type { ObjectId } from 'types'

interface StoryPageProps {
    storyId: string
    fileId?: string
    edit?: string
}

const StoryPage: React.FC<{ props: StoryPageProps }> = ({ props }) => {
    const router = useRouter()
    const validated = useValidation()
    const fileId = props.fileId ?? null

    useEffect(() => {
        if ('storyId' in props) {
            if (!isObjectId(props.storyId)) {
                void router.push(Navigation.storiesURL())
            } else if (!isObjectIdOrNull(fileId)) {
                void router.push(Navigation.storyURL(props.storyId))
            }
        }
    }, [props, fileId, router])

    return (
        <Loading loaded={validated && isObjectId(props.storyId) && isObjectIdOrNull(fileId)}>
            <StoryContext storyId={props.storyId as ObjectId} edit={'edit' in props}>
                <StoryView fileId={asObjectId(fileId)}/>
            </StoryContext>
        </Loading>
    )
}

export default StoryPage

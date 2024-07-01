import { useEffect } from 'react'
import { useRouter } from 'next/router'
import CreateStoryView from 'views/createStory'
import Loading from 'components/loading'
import { isObjectId } from 'utils'
import { useValidation } from 'utils/hooks/validation'
import Navigation from 'utils/navigation'
import type { ObjectId } from 'types'

interface EditStoryPageProps {
    storyId?: ObjectId
}

const EditStoryPage: React.FC<{ props: EditStoryPageProps }> = ({ props }) => {
    const router = useRouter()
    const validated = useValidation()

    useEffect(() => {
        if ('storyId' in props) {
            if (!isObjectId(props.storyId)) {
                void router.push(Navigation.StoriesPath)
            }
        }
    }, [props, router])

    return (
        <Loading loaded={validated && isObjectId(props.storyId)}>
            <CreateStoryView storyId={props.storyId}/>
        </Loading>
    )
}

export default EditStoryPage

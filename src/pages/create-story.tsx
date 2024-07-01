import CreateStoryView from 'views/createStory'
import Loading from 'components/loading'
import { useValidation } from 'utils/hooks/validation'

const CreateStoryPage: React.FC = () => {
    const valid = useValidation()
    return (
        <Loading loaded={valid}>
            <CreateStoryView/>
        </Loading>
    )
}

export default CreateStoryPage

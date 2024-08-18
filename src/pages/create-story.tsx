import CreateStoryView from 'components/views/editStory'
import Loading from 'components/controls/loading'
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

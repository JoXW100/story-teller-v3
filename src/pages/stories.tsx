import StoriesView from 'components/views/stories'
import Loading from 'components/controls/loading'
import { useValidation } from 'utils/hooks/validation'

const StoriesPage: React.FC = () => {
    const valid = useValidation()
    return (
        <Loading loaded={valid}>
            <StoriesView/>
        </Loading>
    )
}

export default StoriesPage

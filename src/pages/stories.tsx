import StoriesView from 'views/stories'
import Loading from 'components/loading'
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

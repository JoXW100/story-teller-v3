import { useUser } from '@auth0/nextjs-auth0/client'
import Loading from 'components/loading'
import HomeView from 'views/home'

const HomePage: React.FC = () => {
    const { isLoading } = useUser()
    return (
        <Loading loaded={!isLoading}>
            <HomeView/>
        </Loading>
    )
}

export default HomePage

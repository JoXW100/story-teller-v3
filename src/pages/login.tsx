import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '@auth0/nextjs-auth0/client'
import Loading from 'components/loading'
import Navigation from 'utils/navigation'

interface LoginPageProps {
    return?: string
}

const LoginPage: React.FC<LoginPageProps> = (props) => {
    const router = useRouter()
    const { user, isLoading } = useUser()

    useEffect(() => {
        if (user === undefined) {
            void router.push(Navigation.LoginAPI)
        } else {
            void router.push(props.return ?? '../')
        }
    }, [user, isLoading, router, props.return])

    return (
        <Loading/>
    )
}

export default LoginPage

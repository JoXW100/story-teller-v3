import { useEffect } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/router'
import Navigation from 'utils/navigation'

export function useValidation(): boolean {
    const router = useRouter()
    const context = useUser()

    useEffect(() => {
        if (context.user === undefined && !context.isLoading) {
            void router.push(Navigation.loginURL())
        }
    }, [context.user, context.isLoading, router])

    return !context.isLoading && context.user !== undefined
}

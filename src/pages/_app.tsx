import Head from 'next/head'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import type { AppProps } from 'next/app'
import AppContext from 'components/contexts/app'
import DialogHandler from 'components/dialogs/handler'
import ContextMenu from 'components/controls/contextMenu'
import Navigation from 'utils/navigation'
import 'styles/global.scss'
import 'styles/common.scss'

const App: React.FC<AppProps> = ({ Component, pageProps, router }) => {
    return (
        <UserProvider loginUrl={Navigation.loginPath(router.basePath)}>
            <Head>
                <title key="title">Story Teller</title>
                <link rel="icon" href="/storyteller.ico" />
                <meta name="google-site-verification" content="HLSInHx7aA7G6nENh3w_NwmSZlAPOkS7aUuSXNOeNOg" />
                <meta key="description" name="description" content="Create your own story!" />
                <meta key="og:title" property="og:title" content="Story Teller 2"/>
                <meta key="og:description" property="og:description" content="Create your own story!"/>
                <meta key="og:type" property="og:type" content="website" />
                <meta key="og:image" property="og:image" content="https://story-teller-v2.vercel.app/storyteller.png"/>
                <meta key="twitter:card" property="twitter:card" content="summary"/>
            </Head>
            <AppContext>
                <Component {...pageProps} props={router.query} />
                <DialogHandler/>
                <ContextMenu/>
            </AppContext>
        </UserProvider>
    )
}

export default App

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useUser } from '@auth0/nextjs-auth0/client'
import LogoutIcon from '@mui/icons-material/LogoutSharp'
import LoginIcon from '@mui/icons-material/LoginSharp'
import { Tooltip } from '@mui/material'
import LocalizedText from 'components/localizedText'
import Loading from 'components/loading'
import Locked from 'components/locked'
import AppBar from 'components/layouts/appBar'
import SettingsButton from 'components/layouts/settingsButton'
import { isDefined, isObjectId } from 'utils'
import Navigation from 'utils/navigation'
import Logger from 'utils/logger'
import Communication from 'utils/communication'
import type { IDatabaseStory } from 'types/database'
import styles from 'styles/pages/home.module.scss'

interface HomeState {
    loading: boolean
    lastStory: IDatabaseStory | null
}

const HomeView: React.FC = () => {
    const router = useRouter()
    const { user } = useUser()
    const [state, setState] = useState<HomeState>({
        loading: false,
        lastStory: null
    })

    const continueButtonStyle: React.CSSProperties | undefined = isDefined(state.lastStory?.image)
        ? { backgroundImage: `url(${state.lastStory.image}), url('/library.jpg'), url('/library.jpg')` }
        : undefined

    const cardButtonClickHandler: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        switch (e.currentTarget.id) {
            case 'continueButton':
                if (state.lastStory !== null && isObjectId(state.lastStory.id)) {
                    void router.push(Navigation.storyURL(state.lastStory.id))
                }
                break
            case 'storiesButton':
                void router.push(Navigation.storiesURL()); break
            case 'mapButton':
            default:
        }
    }

    useEffect(() => {
        setState((state) => {
            if (user !== undefined && !state.loading) {
                Communication.getLastUpdatedStory().then((response) => {
                    setState((state) => ({ ...state, loading: false, lastStory: response }))
                }, (res: unknown) => {
                    Logger.throw('HomeView.getLastUpdatedStory', res)
                    setState((state) => ({ ...state, loading: false, lastStory: null }))
                })

                return { ...state, loading: true }
            }

            if (state.lastStory !== null) {
                return { ...state, lastStory: null }
            }

            return state
        })
    }, [user])

    return (
        <div className={styles.view}>
            <AppBar headerId='home-header' iconId='home'>
                { user === undefined
                    ? <Tooltip title={<LocalizedText className={styles.headerButtonTooltips} id='login-user'/>}>
                        <Link href={Navigation.LoginAPI}>
                            <button className={styles.headerButton}>
                                <LocalizedText className='no-line-break label-xl mobile-hide' id='login-user'/>
                                <LoginIcon/>
                            </button>
                        </Link>
                    </Tooltip>
                    : <Tooltip title={<LocalizedText className={styles.headerButtonTooltips} id='logout-user' args={[user?.name ?? '']}/>}>
                        <Link href={Navigation.LogoutAPI}>
                            <button className={styles.headerButton}>
                                <LocalizedText className='no-line-break label-xl mobile-hide' id='logout-user' args={[user?.name ?? '']}/>
                                <LogoutIcon/>
                            </button>
                        </Link>
                    </Tooltip>
                }
                <SettingsButton/>
            </AppBar>

            <div className={styles.headerContainer}>
                <LocalizedText id='app-name-full'/>
            </div>

            <div className={styles.contentHolder}>
                <button id='continueButton' onClick={cardButtonClickHandler} disabled={user === undefined || state.lastStory === null}>
                    <Loading loaded={!state.loading}>
                        <Locked locked={user === undefined} textId='login-required-access'>
                            <div style={continueButtonStyle}>
                                <LocalizedText className='no-line-break' id='home-card-continue' args={[state.lastStory?.name ?? 'Story']}/>
                            </div>
                        </Locked>
                    </Loading>
                </button>
                <button id='storiesButton' onClick={cardButtonClickHandler} disabled={user === undefined}>
                    <Locked locked={user === undefined} textId='login-required-access'>
                        <div>
                            <LocalizedText className='no-line-break' id='home-card-stories'/>
                        </div>
                    </Locked>
                </button>
                <button id='galleryButton' onClick={cardButtonClickHandler}>
                    <div>
                        <LocalizedText className='no-line-break' id='home-card-gallery'/>
                    </div>
                </button>
                <button id='mapButton' onClick={cardButtonClickHandler} disabled={user === undefined}>
                    <Locked locked={user === undefined} textId='login-required-access'>
                        <div>
                            <LocalizedText className='no-line-break' id='home-card-map'/>
                        </div>
                    </Locked>
                </button>
            </div>
        </div>
    )
}

export default HomeView

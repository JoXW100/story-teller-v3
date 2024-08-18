import { useContext, useMemo } from 'react'
import { Context as StoryContext } from 'components/contexts/story'
import FileCard from 'components/controls/cards/fileCard'
import { isDefined } from 'utils'
import { useAllFiles, useLastUpdatedFiles } from 'utils/hooks/files'
import { FlagType } from 'structure/database'
import styles from './style.module.scss'
import LocalizedText from 'components/controls/localizedText'
import Loading from 'components/controls/loading'

const FlagTypes = [FlagType.Favorite] as const
const FileHomeView: React.FC = () => {
    const [context] = useContext(StoryContext)
    const favoriteSources = useMemo(() => [context.story.id] as const, [context.story.id])
    const [favorites, loadingFavorites] = useAllFiles(favoriteSources, undefined, FlagTypes)
    const [recent, loadingRecent] = useLastUpdatedFiles(context.story.id, 4)

    const hasFavorite = loadingFavorites || favorites.some(isDefined)
    const hasRecent = loadingRecent || recent.some(isDefined)

    return (
        <div className={styles.home}>
            <div className={styles.holder}>
                { hasFavorite &&
                    <>
                        <div className={styles.headerBox}>
                            <LocalizedText id='fileHomeView-favorites'/>
                        </div>
                        <div className={styles.content}>
                            <Loading loaded={!loadingFavorites}>
                                { favorites.map(item => item !== null &&
                                    <FileCard key={item.id} file={item}/>
                                )}
                            </Loading>
                        </div>
                    </>
                }{ hasRecent &&
                    <>
                        <div className={styles.headerBox}>
                            <LocalizedText id='fileHomeView-recent'/>
                        </div>
                        <div className={styles.content}>
                            <Loading loaded={!loadingRecent}>
                                { recent.map(item => item !== null &&
                                    <FileCard key={item.id} file={item}/>
                                )}
                            </Loading>
                        </div>
                    </>
                }{ !hasFavorite && !hasRecent &&
                    <>
                        <div className={styles.headerBox}>
                            <LocalizedText id='fileHomeView-empty'/>
                        </div>
                        <div className='center-flex'>
                            <LocalizedText id='fileHomeView-empty-body'/>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}

export default FileHomeView

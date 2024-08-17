import { useContext, useMemo } from 'react'
import { Context as StoryContext } from 'components/contexts/story'
import FileCard from 'components/controls/cards/fileCard'
import { isDefined } from 'utils'
import { useAllFiles, useLastUpdatedFiles } from 'utils/hooks/files'
import { FlagType } from 'structure/database'
import styles from './style.module.scss'
import LocalizedText from 'components/controls/localizedText'

const FlagTypes = [FlagType.Favorite] as const
const FileHomeView: React.FC = () => {
    const [context] = useContext(StoryContext)
    const favoriteSources = useMemo(() => [context.story.id] as const, [context.story.id])
    const [favorites] = useAllFiles(favoriteSources, undefined, FlagTypes)
    const [recent] = useLastUpdatedFiles(context.story.id, 4)

    const hasFavorite = favorites.some(isDefined)
    const hasRecent = recent.some(isDefined)

    return (
        <div className={styles.home}>
            <div className={styles.holder}>
                { hasFavorite &&
                    <>
                        <div className={styles.headerBox}>
                            <LocalizedText id='fileHomeView-favorites'/>
                        </div>
                        <div className={styles.content}>
                            { favorites.map(item => item !== null &&
                                <FileCard key={item.id} file={item}/>
                            )}
                        </div>
                    </>
                }{ hasRecent &&
                    <>
                        <div className={styles.headerBox}>
                            <LocalizedText id='fileHomeView-recent'/>
                        </div>
                        <div className={styles.content}>
                            { recent.map(item => item !== null &&
                                <FileCard key={item.id} file={item}/>
                            )}
                        </div>
                    </>
                }{ !hasFavorite && !hasRecent &&
                    <div className={styles.headerBox}>
                        <LocalizedText id='fileHomeView-empty'/>
                    </div>
                }
            </div>
        </div>
    )
}

export default FileHomeView

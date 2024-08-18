import React, { useContext } from 'react'
import GroupItemComponent from './groupItem'
import Checkbox from 'components/controls/checkbox'
import { Context as StoryContext } from 'components/contexts/story'
import { Context as FileContext } from 'components/contexts/file'
import { FlagType } from 'structure/database'
import styles from '../style.module.scss'
import { openDialog } from 'components/dialogs/handler'
import Link from 'next/link'
import Navigation from 'utils/navigation'
import { Tooltip } from '@mui/material'
import LocalizedText from 'components/controls/localizedText'

const PublishComponent: React.FC = () => {
    const [ctx] = useContext(StoryContext)
    const [context, dispatch] = useContext(FileContext)

    const handleInput = (value: boolean): void => {
        if (value) {
            openDialog('confirmation', {
                id: 'confirmation-publish',
                headerTextId: 'editor-publish-dialog-header',
                headerTextArgs: [context.file.getTitle()],
                bodyTextId: 'editor-publish-dialog-body'
            }).onConfirm(() => {
                dispatch.publish(true)
            })
        } else {
            dispatch.publish(false)
        }
    }

    const isPublicStory = ctx.story.flags.includes(FlagType.Public)
    const isPublic = isPublicStory || context.file.flags.includes(FlagType.Public)
    const href = Navigation.viewURL(context.file.id)

    return (
        <GroupItemComponent labelId='editor-publish' className={styles.editBoolean}>
            <Tooltip title={isPublicStory && <LocalizedText id='editor-publish-tooltips'/>}>
                <div>
                    <Checkbox value={isPublic} onChange={handleInput} disabled={isPublicStory}/>
                </div>
            </Tooltip>
            { isPublic &&
                <Link href={href}>
                    <button className={styles.linkHolder}>
                        {String(href)}
                    </button>
                </Link>
            }
        </GroupItemComponent>
    )
}

export default PublishComponent

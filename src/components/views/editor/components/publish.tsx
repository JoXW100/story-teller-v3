import React, { useContext } from 'react'
import GroupItemComponent from './groupItem'
import Checkbox from 'components/controls/checkbox'
import { Context } from 'components/contexts/file'
import { FlagType } from 'structure/database'
import styles from '../style.module.scss'
import { openDialog } from 'components/dialogs/handler'
import Link from 'next/link'
import Navigation from 'utils/navigation'

const PublishComponent: React.FC = () => {
    const [context, dispatch] = useContext(Context)

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

    const isPublic = context.file.flags.includes(FlagType.Public)
    const href = Navigation.viewURL(context.file.id)

    return (
        <GroupItemComponent labelId='editor-publish' className={styles.editBoolean}>
            <Checkbox value={isPublic} onChange={handleInput}/>
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

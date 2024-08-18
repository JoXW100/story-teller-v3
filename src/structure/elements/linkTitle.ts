import { isObjectId } from 'utils'
import { Element } from '.'
import type { ObjectId } from 'types'

export type LinkTitleElementParams = React.PropsWithoutRef<{
    fileId: ObjectId
    newTab: boolean
}>

class LinkTitleElement extends Element<LinkTitleElementParams> {
    public readonly name = 'linkTitle'
    public readonly defaultParam = 'fileId'
    public readonly params = {
        'fileId': {
            validate: (value) => isObjectId(value),
            parse: (value) => value as ObjectId
        },
        'newTab': {
            default: false,
            validate: (value) => value === 'true' || value === 'false',
            parse: (value) => value === 'true'
        }
    } satisfies Element<LinkTitleElementParams>['params']
}

export default LinkTitleElement

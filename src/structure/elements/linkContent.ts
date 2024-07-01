import { asObjectId, isObjectId } from 'utils'
import { Element } from '.'
import type { ObjectId } from 'types'

export type LinkContentElementParams = React.PropsWithoutRef<{
    fileId: ObjectId | null
    border: boolean
    newTab: boolean
}>

class LinkContentElement extends Element<LinkContentElementParams> {
    public readonly name = 'link'
    public readonly defaultParam = 'fileId'
    public readonly params = {
        'fileId': {
            validate: (value) => isObjectId(value),
            parse: (value) => asObjectId(value)
        },
        'border': {
            default: false,
            validate: (value) => value === 'true' || value === 'false',
            parse: (value) => value === 'true'
        },
        'newTab': {
            default: false,
            validate: (value) => value === 'true' || value === 'false',
            parse: (value) => value === 'true'
        }
    } satisfies Element<LinkContentElementParams>['params']
}

export default LinkContentElement

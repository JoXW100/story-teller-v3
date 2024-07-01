import Icons from 'assets/icons'
import { asKeyOf, isKeyOf } from 'utils'
import { Element } from '.'

export type IconElementParams = React.PropsWithoutRef<{
    icon: keyof typeof Icons
    tooltips: string | null
}>

class IconElement extends Element<IconElementParams> {
    public readonly name = 'icon'
    public readonly defaultParam = 'icon'
    public readonly params = {
        'icon': {
            default: 'error',
            validate: (value) => isKeyOf(value, Icons),
            parse: (value) => asKeyOf(value, Icons, 'error')
        },
        'tooltips': {
            default: null,
            validate: () => true,
            parse: (value) => value
        }
    } satisfies Element<IconElementParams>['params']
}

export default IconElement

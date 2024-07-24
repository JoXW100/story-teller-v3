import { useContext, useMemo } from 'react'
import LocalizedText from 'components/controls/localizedText'
import Elements, { ElementDictionary } from 'components/elements'
import { Context } from 'components/contexts/file'
import { isDefined } from 'utils'
import { getOptionType } from 'structure/optionData'
import type { ItemData } from 'structure/database/files/item/factory'

const ItemDocumentRenderer: React.FC = (): React.ReactNode => {
    const [context] = useContext(Context)
    const data = context.file.data as ItemData
    const descriptionToken = useMemo(() => {
        if (isDefined(context.tokens.description)) {
            return context.tokens.description
        } else {
            return context.file.getTokenizedDescription(ElementDictionary)
        }
    }, [context.file, context.tokens.description])

    return <>
        <Elements.h1 underline>{data.name}</Elements.h1>
        {`${data.categoryText}, ${getOptionType('rarity').options[data.rarity]} `}
        { data.attunement &&
            <LocalizedText id='renderer-item-requiresAttunement'/>
        }
        <Elements.line width='2px'/>
        <Elements.h3 underline={false}>
            <LocalizedText id='renderer-item-description'/>
        </Elements.h3>
        { descriptionToken.build() }
    </>
}

export default ItemDocumentRenderer

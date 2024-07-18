import { useContext } from 'react'
import { Context } from 'components/contexts/file'
import type { ItemData } from 'structure/database/files/item/factory'
import Elements from 'components/elements'
import { getOptionType } from 'structure/optionData'
import LocalizedText from 'components/localizedText'

const ItemDocumentRenderer: React.FC = (): React.ReactNode => {
    const [context] = useContext(Context)
    const data = context.file.data as ItemData

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
        { context.tokens.description?.build() }
    </>
}

export default ItemDocumentRenderer

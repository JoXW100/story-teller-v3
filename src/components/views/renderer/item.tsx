import { useContext, useMemo } from 'react'
import LocalizedText from 'components/controls/localizedText'
import Elements, { ElementDictionary } from 'components/elements'
import { Context } from 'components/contexts/file'
import { useLocalizedEnums, useTranslator } from 'utils/hooks/localization'
import type { ItemData } from 'structure/database/files/item/factory'

const ItemDocumentRenderer: React.FC = (): React.ReactNode => {
    const [context] = useContext(Context)
    const translator = useTranslator()
    const options = useLocalizedEnums('rarity')
    const data = context.file.data as ItemData
    const descriptionToken = useMemo(() => {
        return context.file.getTokenizedDescription(ElementDictionary)
    }, [context.file])

    return <>
        <Elements.h1 underline>{data.name}</Elements.h1>
        {`${data.getCategoryText(translator)}, ${options[data.rarity]} `}
        { data.attunement &&
            <LocalizedText id='render-item-requiresAttunement'/>
        }
        <Elements.line width='2px'/>
        <Elements.h3 underline={false}>
            <LocalizedText id='render-item-description'/>
        </Elements.h3>
        { descriptionToken.build() }
    </>
}

export default ItemDocumentRenderer

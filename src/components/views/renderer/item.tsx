import { useContext, useMemo } from 'react'
import LocalizedText from 'components/controls/localizedText'
import Elements, { ElementDictionary } from 'components/elements'
import { Context } from 'components/contexts/file'
import { useLocalizedEnums, useTranslator } from 'utils/hooks/localization'
import StoryScript from 'structure/language/storyscript'
import type { ItemData } from 'structure/database/files/item/factory'

const ItemDocumentRenderer: React.FC = (): React.ReactNode => {
    const [context] = useContext(Context)
    const data = context.file.data as ItemData
    const translator = useTranslator()
    const options = useLocalizedEnums('rarity')
    const [, contentContext] = useMemo(() => data.createContexts(ElementDictionary), [data])
    const descriptionToken = contentContext.description!
    const contentToken = useMemo(() => {
        return StoryScript.tokenize(ElementDictionary, data.content, contentContext).root
    }, [contentContext, data.content])

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
        { !contentToken.isEmpty &&
            <>
                <Elements.line width='2px'/>
                { contentToken.build() }
            </>
        }
    </>
}

export default ItemDocumentRenderer

import { useContext, useMemo } from 'react'
import Elements, { ElementDictionary } from 'components/elements'
import LocalizedText from 'components/localizedText'
import { Context } from 'components/contexts/file'
import { isDefined } from 'utils'
import type CharacterFacade from 'structure/database/files/character/facade'

type CharacterBackgroundPageProps = React.PropsWithRef<{
    facade: CharacterFacade
}>

const CharacterBackgroundPage: React.FC<CharacterBackgroundPageProps> = ({ facade }) => {
    const [context] = useContext(Context)
    const descriptionToken = useMemo(() => {
        if (isDefined(context.tokens.description)) {
            return context.tokens.description
        } else {
            return context.file.getTokenizedDescription(ElementDictionary)
        }
    }, [context.file, context.tokens.description])

    return (
        <>
            {`${facade.sizeText} ${facade.typeText}, ${facade.alignmentText}`}
            <Elements.line width='2px'/>
            <div>
                <LocalizedText className='font-bold' id='render-race'/>
                {facade.raceName}
            </div>
            <div>
                <LocalizedText className='font-bold' id='render-gender'/>
                {facade.gender}
            </div>
            <div>
                <LocalizedText className='font-bold' id='render-age'/>
                {facade.age}
            </div>
            <div>
                <LocalizedText className='font-bold' id='render-height'/>
                {facade.height}
            </div>
            <div>
                <LocalizedText className='font-bold' id='render-weight'/>
                {facade.weight}
            </div>
            <Elements.line width='2px'/>
            <Elements.h3 underline={false}>Description</Elements.h3>
            { descriptionToken.build() }
        </>
    )
}

export default CharacterBackgroundPage

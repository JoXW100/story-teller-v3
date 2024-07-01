import { useContext } from 'react'
import { Context } from 'components/contexts/file'
import Elements from 'components/elements'
import type CharacterFacade from 'structure/database/files/character/facade'
import LocalizedText from 'components/localizedText'

type CharacterBackgroundPageProps = React.PropsWithRef<{
    facade: CharacterFacade
}>

const CharacterBackgroundPage: React.FC<CharacterBackgroundPageProps> = ({ facade }) => {
    const [context] = useContext(Context)
    return (
        <>
            {`${facade.sizeText} ${facade.typeText}, ${facade.alignmentText}`}
            <Elements.line width='2px'/>
            <div>
                <LocalizedText className='font-bold' id='render-race'/>
                {facade.raceText}
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
            { context.tokens.description?.build() }
        </>
    )
}

export default CharacterBackgroundPage

import { useContext, useMemo } from 'react'
import Elements, { ElementDictionary } from 'components/elements'
import LocalizedText from 'components/controls/localizedText'
import { Context } from 'components/contexts/file'
import type CharacterFacade from 'structure/database/files/character/facade'
import styles from '../styles.module.scss'

type CharacterBackgroundPageProps = React.PropsWithRef<{
    facade: CharacterFacade
}>

const CharacterBackgroundPage: React.FC<CharacterBackgroundPageProps> = ({ facade }) => {
    const [context] = useContext(Context)
    const descriptionToken = useMemo(() => {
        return context.file.getTokenizedDescription(ElementDictionary)
    }, [context.file])

    return (
        <>
            {`${facade.sizeText} ${facade.typeText}, ${facade.alignmentText}`}
            <Elements.line width='2px'/>
            <div className={styles.iconRow}>
                <LocalizedText className='font-bold' id='render-race'/>
                <span>{facade.raceName}</span>
            </div>
            <div className={styles.iconRow}>
                <LocalizedText className='font-bold' id='render-gender'/>
                <span>{facade.gender}</span>
            </div>
            <div className={styles.iconRow}>
                <LocalizedText className='font-bold' id='render-age'/>
                <span>{facade.age}</span>
            </div>
            <div className={styles.iconRow}>
                <LocalizedText className='font-bold' id='render-height'/>
                <span>{facade.height}</span>
            </div>
            <div className={styles.iconRow}>
                <LocalizedText className='font-bold' id='render-weight'/>
                <span>{facade.weight}</span>
            </div>
            <Elements.line width='2px'/>
            <Elements.h3 underline={false}>Description</Elements.h3>
            { descriptionToken.build() }
        </>
    )
}

export default CharacterBackgroundPage

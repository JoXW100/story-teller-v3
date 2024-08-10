import { useMemo } from 'react'
import Elements, { ElementDictionary } from 'components/elements'
import type { ModifierData } from 'structure/database/files/modifier/factory'
import StoryScript from 'structure/language/storyscript'
import styles from './styles.module.scss'

type ModifierDataRenderProps = React.PropsWithRef<{
    data: ModifierData
}>

export const ModifierDataRender: React.FC<ModifierDataRenderProps> = ({ data }) => {
    const description = useMemo(() => {
        const [description] = data.createContexts(ElementDictionary)
        return StoryScript.tokenize(ElementDictionary, data.description, description).root
    }, [data])

    return (
        <div className={styles.rendererBox} data='true'>
            <Elements.h4 underline={false}>{data.name}</Elements.h4>
            { description.build() }
        </div>
    )
}

export default ModifierDataRender

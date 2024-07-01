import { useContext } from 'react'
import { Context } from 'components/contexts/file'
import type RaceData from 'structure/database/files/race/data'
import Elements from 'components/elements'

const RaceDocumentRenderer: React.FC = (): React.ReactNode => {
    const [context] = useContext(Context)
    const data = context.file.data as RaceData

    return <>
        <Elements.h1 underline>{data.name}</Elements.h1>
        {`${data.sizeText} ${data.typeText}`}
        <Elements.line width='2px'/>
        { context.tokens.description?.build() }
    </>
}

export default RaceDocumentRenderer

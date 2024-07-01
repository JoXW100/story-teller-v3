import { useContext, useMemo } from 'react'
import { Tooltip } from '@mui/material'
import { Context } from 'components/contexts/file'
import DropdownMenu from 'components/layouts/dropdownMenu'
import LinkInput from 'components/layouts/linkInput'
import { ElementDictionary } from 'components/elements'
import { asObjectId, keysOf } from 'utils'
import type CharacterFacade from 'structure/database/files/character/facade'
import type ModifierDocument from 'structure/database/files/modifier'
import { type IOptionType, getOptionType } from 'structure/optionData'
import styles from '../styles.module.scss'

type ChoicePageProps = React.PropsWithRef<{
    facade: CharacterFacade
}>

type ModifierChoiceItemProps = React.PropsWithRef<{
    facade: CharacterFacade
    modifier: ModifierDocument
}>

const ModifierChoiceItem: React.FC<ModifierChoiceItemProps> = ({ facade, modifier }) => {
    const [, dispatch] = useContext(Context)
    const data = useMemo(() => modifier.data.getEditorChoiceData(), [modifier])
    const options = useMemo<Record<number, React.ReactNode>>(() => {
        const options: Record<number, React.ReactNode> = {}
        if (data === null) {
            return options
        }

        switch (data.type) {
            case 'enum': {
                const optionType = getOptionType(data.enum!) as IOptionType
                return data.value.map((value) => (
                    optionType?.options[String(value)] ?? value
                )) as Record<number, React.ReactNode>
            }
            case 'id': {
                return data.value.map((value) => (
                    <LinkInput
                        key={String(value)}
                        value={asObjectId(value)}
                        allowedTypes={data.allowedTypes!}
                        allowText={false}
                        disabled/>
                ))
            }
            case 'value': {
                return data.value as Record<number, React.ReactNode>
            }
        }
    }, [data])

    if (data === null) {
        return null
    }

    const handleChange = (value: unknown): void => {
        const index = Number(value)
        if (isNaN(index)) {
            return
        }
        dispatch.setStorage('choices', { ...facade.storage.choices, [modifier.id]: index })
    }

    return (
        <div className={styles.modifierChoice}>
            <Tooltip title={modifier.getTokenizedDescription(ElementDictionary).build()}>
                <b>{modifier.data.name}</b>
            </Tooltip>
            <DropdownMenu
                value={Number(facade.storage.choices[modifier.id])}
                values={options}
                onChange={handleChange}/>
        </div>
    )
}

const CharacterChoicePage: React.FC<ChoicePageProps> = ({ facade }) => {
    const modifiers = useMemo(() => facade.modifier.getAllModifiers(), [facade])
    return <>
        { keysOf(modifiers).map((id) =>
            <ModifierChoiceItem key={id} facade={facade} modifier={modifiers[id]}/>
        )}
    </>
}

export default CharacterChoicePage

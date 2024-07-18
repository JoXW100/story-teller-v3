import { useContext, useMemo } from 'react'
import { Tooltip } from '@mui/material'
import { Context } from 'components/contexts/file'
import ClearIcon from '@mui/icons-material/CloseSharp'
import DropdownMenu from 'components/layouts/dropdownMenu'
import ListMenu from 'components/layouts/menus/list'
import LocalizedText from 'components/localizedText'
import { ElementDictionary } from 'components/elements'
import { asNumber, isEnum, isKeyOf, isNumber, isObjectId, keysOf } from 'utils'
import { useFile, useLinked, useSubclasses } from 'utils/hooks/files'
import { getOptionType } from 'structure/optionData'
import type CharacterFacade from 'structure/database/files/character/facade'
import StoryScript from 'structure/language/storyscript'
import type ClassData from 'structure/database/files/class/data'
import type { ObjectId } from 'types'
import type { IEditorChoiceData, IEditorEnumChoiceData, IEditorExternalChoiceData, IEditorValueChoiceData } from 'types/database/choice'
import styles from '../styles.module.scss'

type ChoicePageProps = React.PropsWithRef<{
    facade: CharacterFacade
}>

type ModifierChoiceItemProps = React.PropsWithRef<{
    facade: CharacterFacade
    choiceKey: string
    data: IEditorChoiceData
}>

type ModifierChoiceEnumItemProps = React.PropsWithRef<{
    facade: CharacterFacade
    choiceKey: string
    data: IEditorEnumChoiceData
}>

type ModifierChoiceValueItemProps = React.PropsWithRef<{
    facade: CharacterFacade
    choiceKey: string
    data: IEditorValueChoiceData
}>

type ModifierChoiceExternalItemProps = React.PropsWithRef<{
    facade: CharacterFacade
    choiceKey: string
    data: IEditorExternalChoiceData
}>

type SubclassChoiceItemProps = React.PropsWithRef<{
    facade: CharacterFacade
    id: ObjectId
    data: ClassData // Data of the class to find the subclass of
}>

type ModifierLinkItemProps = React.PropsWithRef<{
    fileId: ObjectId
}>

const ModifierLinkItem: React.FC<ModifierLinkItemProps> = ({ fileId }) => {
    const [file] = useFile(fileId)
    return (
        <span className={styles.modifierLinkItem}>
            {file?.getTitle()}
        </span>
    )
}

function getValueArray(value: unknown, validate: (value: unknown) => boolean): unknown[] {
    return Array.isArray(value) && value.every(validate) ? value.map(String) : []
}

const ModifierChoiceEnumItem: React.FC<ModifierChoiceEnumItemProps> = ({ facade, choiceKey, data }) => {
    const [, dispatch] = useContext(Context)
    const optionType = getOptionType(data.enum)
    const options = useMemo<Record<string, React.ReactNode>>(() => {
        const options: Record<string, React.ReactNode> = {}
        if (data === null) {
            return options
        }

        for (let i = 0; i < data.value.length; i++) {
            const value = data.value[i]
            if (isEnum(value, optionType.enum)) {
                options[String(i)] = optionType.options[value]
            } else {
                options[String(i)] = String(value)
            }
        }
        return options
    }, [data, optionType.enum, optionType.options])
    const value = getValueArray(facade.storage.choices[choiceKey], (value) => isKeyOf(value, options)) as Array<keyof typeof options>

    const handleChange = (value: unknown): void => {
        if (Array.isArray(value)) {
            const indices = value.map<number>(asNumber)
            if (!indices.some(isNaN)) {
                dispatch.setStorage('choices', { ...facade.storage.choices, [choiceKey]: indices })
            }
        } else {
            const index = Number(value)
            if (!isNaN(index)) {
                dispatch.setStorage('choices', { ...facade.storage.choices, [choiceKey]: isNumber(data.numChoices) ? [index] : index })
            }
        }
    }

    return isNumber(data.numChoices) && data.numChoices > 1
        ? <ListMenu
            type='enum'
            itemClassName={styles.modifierChoiceItem}
            values={value}
            defaultValue={keysOf(options).find(x => !value.includes(x)) ?? 0}
            options={options}
            onChange={handleChange}
            disabled={value.length >= data.numChoices}/>
        : <DropdownMenu
            value={value[0]}
            values={options}
            className={styles.modifierChoiceItem}
            onChange={handleChange}/>
}

const ModifierChoiceValueItem: React.FC<ModifierChoiceValueItemProps> = ({ facade, choiceKey, data }) => {
    const [, dispatch] = useContext(Context)
    const options = useMemo<Record<string, React.ReactNode>>(() => {
        const options: Record<string, React.ReactNode> = {}
        if (data === null) {
            return options
        }

        for (let i = 0; i < data.value.length; i++) {
            const value = data.value[i]
            if (data.type === 'id' && isObjectId(value)) {
                options[String(i)] = <ModifierLinkItem fileId={value}/>
            } else {
                options[String(i)] = String(value)
            }
        }
        return options
    }, [data])
    const value = getValueArray(facade.storage.choices[choiceKey], (value) => isKeyOf(value, options)) as Array<keyof typeof options>

    const handleChange = (value: unknown): void => {
        if (Array.isArray(value)) {
            const indices = value.map<number>(asNumber)
            if (!indices.some(isNaN)) {
                dispatch.setStorage('choices', { ...facade.storage.choices, [choiceKey]: indices })
            }
        } else {
            const index = Number(value)
            if (!isNaN(index)) {
                dispatch.setStorage('choices', { ...facade.storage.choices, [choiceKey]: isNumber(data.numChoices) ? [index] : index })
            }
        }
    }

    return isNumber(data.numChoices) && data.numChoices > 1
        ? <ListMenu
            type='enum'
            itemClassName={styles.modifierChoiceItem}
            values={value}
            defaultValue={keysOf(options).find(x => !value.includes(x)) ?? 0}
            options={options}
            onChange={handleChange}
            disabled={value.length >= data.numChoices}/>
        : <DropdownMenu
            value={value[0]}
            values={options}
            className={styles.modifierChoiceItem}
            onChange={handleChange}/>
}

const ModifierChoiceLinkedItem: React.FC<ModifierChoiceExternalItemProps> = ({ facade, choiceKey, data }) => {
    const [, dispatch] = useContext(Context)
    const [external] = useLinked(data.category)
    const options = useMemo<Record<ObjectId, React.ReactNode>>(() => {
        const options: Record<ObjectId, React.ReactNode> = {}
        if (data === null) {
            return options
        }

        for (const value of external) {
            if (value === null) {
                continue
            }
            options[value.id] = value.getTitle()
        }
        return options
    }, [data, external])
    const value = getValueArray(facade.storage.choices[choiceKey], (value) => isKeyOf(value, options)) as Array<keyof typeof options>

    const handleChange = (value: unknown): void => {
        if (Array.isArray(value)) {
            if (value.every((value): value is keyof typeof options => isKeyOf(value, options))) {
                dispatch.setStorage('choices', { ...facade.storage.choices, [choiceKey]: value })
            }
        } else {
            if (isObjectId(value) && value in options) {
                dispatch.setStorage('choices', { ...facade.storage.choices, [choiceKey]: isNumber(data.numChoices) ? [value] : value })
            }
        }
    }

    return isNumber(data.numChoices) && data.numChoices > 1
        ? <ListMenu
            type='enum'
            itemClassName={styles.modifierChoiceItem}
            values={value}
            defaultValue={keysOf(options).find(x => !value.includes(x))!}
            options={options}
            onChange={handleChange}
            disabled={value.length >= data.numChoices}/>
        : <DropdownMenu
            value={value[0]}
            values={options}
            className={styles.modifierChoiceItem}
            onChange={handleChange}/>
}

const ModifierChoiceItem: React.FC<ModifierChoiceItemProps> = ({ facade, choiceKey, data }) => {
    const [, dispatch] = useContext(Context)
    const tooltips = useMemo(() => {
        const [description] = data.source.createContexts(ElementDictionary)
        return StoryScript.tokenize(ElementDictionary, data.source.description, description).root.build() as JSX.Element
    }, [data.source])

    const handleClear = (): void => {
        const { [choiceKey]: _, ...other } = facade.storage.choices
        dispatch.setStorage('choices', other)
    }

    let content = null
    switch (data.type) {
        case 'enum':
            content = <ModifierChoiceEnumItem facade={facade} choiceKey={choiceKey} data={data}/>
            break
        case 'value':
        case 'id':
            content = <ModifierChoiceValueItem facade={facade} choiceKey={choiceKey} data={data}/>
            break
        case 'linked':
            content = <ModifierChoiceLinkedItem facade={facade} choiceKey={choiceKey} data={data}/>
            break
    }

    return (
        <div className={styles.modifierChoice}>
            <Tooltip title={tooltips}>
                <b>{data.source.name}</b>
            </Tooltip>
            { content }
            <Tooltip title={<LocalizedText id='common-clear'/>}>
                <button className='center-flex fill-height' onClick={handleClear}>
                    <ClearIcon className='small-icon'/>
                </button>
            </Tooltip>
        </div>
    )
}

const SubclassChoiceItem: React.FC<SubclassChoiceItemProps> = ({ facade, id, data }) => {
    const [, dispatch] = useContext(Context)
    const [subclasses] = useSubclasses(id)
    const options = useMemo<Record<ObjectId, React.ReactNode>>(() => {
        const options: Record<ObjectId, React.ReactNode> = {}
        if (data === null) {
            return options
        }

        for (let i = 0; i < subclasses.length; i++) {
            const value = subclasses[i]
            if (value === null) {
                continue
            }
            options[value.id] = value.getTitle()
        }
        return options
    }, [data, subclasses])
    const value = facade.storage.subclasses[id]

    const handleChange = (value: ObjectId): void => {
        if (value in options) {
            dispatch.setStorage('subclasses', { ...facade.storage.subclasses, [id]: value })
        }
    }

    const handleClear = (): void => {
        const { [id]: _, ...other } = facade.storage.subclasses
        dispatch.setStorage('subclasses', other)
    }

    return (
        <div className={styles.modifierChoice}>
            <Tooltip title={<LocalizedText id='render-subclass-choice-tooltips' args={[data.name]}/>}>
                <b><LocalizedText id='render-subclass-choice' args={[data.name]}/></b>
            </Tooltip>
            <DropdownMenu<ObjectId>
                value={value}
                values={options}
                className={styles.modifierChoiceItem}
                onChange={handleChange}/>
            <Tooltip title={<LocalizedText id='common-clear'/>}>
                <button className='center-flex fill-height' onClick={handleClear}>
                    <ClearIcon className='small-icon'/>
                </button>
            </Tooltip>
        </div>
    )
}

const CharacterChoicePage: React.FC<ChoicePageProps> = ({ facade }) => {
    const choices = facade.modifier.properties.choices
    return <>
        { keysOf(facade.classes).map((key) => key in facade.classesData &&
            Number(facade.classesData[key].subclassLevel) <= Number(facade.classes[key]) &&
            <SubclassChoiceItem key={key} facade={facade} id={key} data={facade.classesData[key]}/>
        )}
        { keysOf(choices).map((key) =>
            choices[key].source.condition.evaluate(facade.properties, facade.storage.choices) &&
            (!(key in facade.modifier.properties.conditions) || facade.modifier.properties.conditions[key].evaluate(facade.properties, facade.storage.choices)) &&
            <ModifierChoiceItem key={key} facade={facade} choiceKey={key} data={choices[key]}/>
        )}
    </>
}

export default CharacterChoicePage

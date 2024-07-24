import { useContext, useMemo, useState } from 'react'
import { Tooltip } from '@mui/material'
import { Context } from 'components/contexts/file'
import ClearIcon from '@mui/icons-material/CloseSharp'
import DropdownMenu from 'components/controls/dropdownMenu'
import ListMenu from 'components/controls/menus/list'
import LinkListMenu from 'components/controls/menus/link'
import LocalizedText from 'components/controls/localizedText'
import LinkInput from 'components/controls/linkInput'
import { ElementDictionary } from 'components/elements'
import { asNumber, isKeyOf, isNumber, isObjectId, keysOf } from 'utils'
import { useAbilitiesOfCategory, useFilesOfType, useSubFiles } from 'utils/hooks/files'
import StoryScript from 'structure/language/storyscript'
import { DocumentType } from 'structure/database'
import type DatabaseFile from 'structure/database/files'
import type RaceData from 'structure/database/files/race/data'
import type ClassData from 'structure/database/files/class/data'
import type CharacterFacade from 'structure/database/files/character/facade'
import type { ObjectId } from 'types'
import type { IEditorChoiceData, IEditorDocumentChoiceData, IEditorEnumChoiceData, IEditorLinkedChoiceData, IEditorValueChoiceData } from 'types/database/choice'
import styles from '../styles.module.scss'
import { useLocalizedOptions } from 'utils/hooks/localization'

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

type ModifierChoiceDocumentItemProps = React.PropsWithRef<{
    facade: CharacterFacade
    choiceKey: string
    data: IEditorDocumentChoiceData
}>

type ModifierChoiceExternalItemProps = React.PropsWithRef<{
    facade: CharacterFacade
    choiceKey: string
    data: IEditorLinkedChoiceData
}>

type SubclassChoiceItemProps = React.PropsWithRef<{
    facade: CharacterFacade
    id: ObjectId // Class id
    data: ClassData // Data of the class to find the subclass of
}>

type SubraceChoiceItemProps = React.PropsWithRef<{
    facade: CharacterFacade
    id: ObjectId // Race id
    data: RaceData // Data of the race to find the subrace of
}>

function getValueArray(value: unknown, validate: (value: unknown) => boolean): unknown[] {
    return Array.isArray(value) && value.every(validate) ? value.map(String) : []
}

const ModifierChoiceEnumItem: React.FC<ModifierChoiceEnumItemProps> = ({ facade, choiceKey, data }) => {
    const [, dispatch] = useContext(Context)
    const optionOptions = useLocalizedOptions('classLevel')
    const options = useMemo<Record<string, React.ReactNode>>(() => {
        const options: Record<string, React.ReactNode> = {}
        if (data === null) {
            return options
        }

        for (let i = 0; i < data.value.length; i++) {
            const value = data.value[i]
            if (isKeyOf(value, optionOptions)) {
                options[String(i)] = optionOptions[value]
            } else {
                options[String(i)] = String(value)
            }
        }
        return options
    }, [data, optionOptions])
    const value = getValueArray(facade.storage.choices[choiceKey], (value) => isKeyOf(value, options)) as Array<keyof typeof options>

    const handleChange = (value: unknown): void => {
        const choices: Record<string, unknown> = {}
        let flag = false
        for (const key of keysOf(facade.modifier.properties.choices)) {
            if (key === choiceKey) {
                if (Array.isArray(value)) {
                    const indices = value.map<number>(asNumber)
                    if (!indices.some(isNaN)) {
                        flag = true
                        choices[key] = indices
                    }
                } else {
                    const index = Number(value)
                    if (!isNaN(index)) {
                        flag = true
                        choices[key] = isNumber(data.numChoices) ? [index] : index
                    }
                }
            } else if (key in facade.storage.choices) {
                choices[key] = facade.storage.choices[key]
            }
        }
        if (flag) {
            dispatch.setStorage('choices', choices)
        }
    }

    return isNumber(data.numChoices) && data.numChoices > 1
        ? <ListMenu
            type='enum'
            className={styles.dropdown}
            itemClassName={styles.dropdownItem}
            values={value}
            defaultValue={keysOf(options).find(x => !value.includes(x)) ?? 0}
            options={options}
            onChange={handleChange}
            disabled={value.length >= data.numChoices}/>
        : <DropdownMenu
            value={value[0]}
            values={options}
            className={styles.dropdown}
            itemClassName={styles.dropdownItem}
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
            options[String(i)] = String(value)
        }
        return options
    }, [data])
    const value = getValueArray(facade.storage.choices[choiceKey], (value) => isKeyOf(value, options)) as Array<keyof typeof options>

    const handleChange = (value: unknown): void => {
        const choices: Record<string, unknown> = {}
        let flag = false
        for (const key of keysOf(facade.modifier.properties.choices)) {
            if (key === choiceKey) {
                if (Array.isArray(value)) {
                    const indices = value.map<number>(asNumber)
                    if (!indices.some(isNaN)) {
                        flag = true
                        choices[key] = indices
                    }
                } else {
                    const index = Number(value)
                    if (!isNaN(index)) {
                        flag = true
                        choices[key] = isNumber(data.numChoices) ? [index] : index
                    }
                }
            } else if (key in facade.storage.choices) {
                choices[key] = facade.storage.choices[key]
            }
        }
        if (flag) {
            dispatch.setStorage('choices', choices)
        }
    }

    return isNumber(data.numChoices) && data.numChoices > 1
        ? <ListMenu
            type='enum'
            className={styles.dropdown}
            itemClassName={styles.dropdownItem}
            values={value}
            defaultValue={keysOf(options).find(x => !value.includes(x)) ?? 0}
            options={options}
            onChange={handleChange}
            disabled={value.length >= data.numChoices}/>
        : <DropdownMenu
            value={value[0]}
            values={options}
            className={styles.dropdown}
            itemClassName={styles.dropdownItem}
            onChange={handleChange}/>
}

const ModifierSelectDocumentItem: React.FC<ModifierChoiceDocumentItemProps> = ({ facade, choiceKey, data }) => {
    const [, dispatch] = useContext(Context)
    const value = getValueArray(facade.storage.choices[choiceKey], isObjectId) as ObjectId[]
    const [text, setText] = useState(String(value[0] ?? ''))

    const handleChange = (value: ObjectId[]): void => {
        dispatch.setStorage('choices', { ...facade.storage.choices, [choiceKey]: value })
    }

    const handleFileChange = (file: DatabaseFile | null): void => {
        const choices: Record<string, unknown> = {}
        let flag = false
        for (const key of keysOf(facade.modifier.properties.choices)) {
            if (key === choiceKey) {
                const id = file?.id ?? null
                if (value[0] !== id) {
                    flag = true
                    choices[key] = [id]
                }
            } else if (key in facade.storage.choices) {
                choices[key] = facade.storage.choices[key]
            }
        }
        if (flag) {
            dispatch.setStorage('choices', choices)
        }
    }

    return isNumber(data.numChoices) && data.numChoices > 1
        ? <LinkListMenu
            className={styles.dropdown}
            itemClassName={styles.dropdownItem}
            values={value}
            allowedTypes={data.allowedTypes}
            onChange={handleChange}
            disabled={value.length >= data.numChoices}
            allowText={false}/>
        : <LinkInput
            value={text}
            allowedTypes={data.allowedTypes}
            className={styles.dropdownItem}
            onChange={setText}
            onFileChanged={handleFileChange}
            allowText={false}/>
}

const ModifierOptionsDocumentItem: React.FC<ModifierChoiceDocumentItemProps> = ({ facade, choiceKey, data }) => {
    const [, dispatch] = useContext(Context)
    const [files] = useFilesOfType(data.value, data.allowedTypes)
    const options = useMemo<Record<string, React.ReactNode>>(() => {
        const options: Record<string, React.ReactNode> = {}
        if (data === null) {
            return options
        }

        for (let i = 0; i < data.value.length; i++) {
            options[String(i)] = files[i]?.getTitle() ?? 'MISSING'
        }
        return options
    }, [data, files])
    const value = getValueArray(facade.storage.choices[choiceKey], (value) => isKeyOf(value, options)) as Array<keyof typeof options>

    const handleChange = (value: unknown): void => {
        const choices: Record<string, unknown> = {}
        let flag = false
        for (const key of keysOf(facade.modifier.properties.choices)) {
            if (key === choiceKey) {
                if (Array.isArray(value)) {
                    const indices = value.map<number>(asNumber)
                    if (!indices.some(isNaN)) {
                        flag = true
                        choices[key] = indices
                    }
                } else {
                    const index = Number(value)
                    if (!isNaN(index)) {
                        flag = true
                        choices[key] = isNumber(data.numChoices) ? [index] : index
                    }
                }
            } else if (key in facade.storage.choices) {
                choices[key] = facade.storage.choices[key]
            }
        }
        if (flag) {
            dispatch.setStorage('choices', choices)
        }
    }

    return isNumber(data.numChoices) && data.numChoices > 1
        ? <ListMenu
            type='enum'
            className={styles.dropdown}
            itemClassName={styles.dropdownItem}
            values={value}
            defaultValue={keysOf(options).find(x => !value.includes(x)) ?? 0}
            options={options}
            onChange={handleChange}
            disabled={value.length >= data.numChoices}/>
        : <DropdownMenu
            value={value[0]}
            values={options}
            className={styles.dropdownItem}
            itemClassName={styles.dropdownItem}
            onChange={handleChange}/>
}

const ModifierChoiceDocumentItem: React.FC<ModifierChoiceDocumentItemProps> = ({ facade, choiceKey, data }) => {
    return data.value.length > 0
        ? <ModifierOptionsDocumentItem facade={facade} choiceKey={choiceKey} data={data}/>
        : <ModifierSelectDocumentItem facade={facade} choiceKey={choiceKey} data={data}/>
}

const ModifierChoiceLinkedItem: React.FC<ModifierChoiceExternalItemProps> = ({ facade, choiceKey, data }) => {
    const [, dispatch] = useContext(Context)
    const [external] = useAbilitiesOfCategory(data.category)
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
        const choices: Record<string, unknown> = {}
        let flag = false
        for (const key of keysOf(facade.modifier.properties.choices)) {
            if (key === choiceKey) {
                if (Array.isArray(value)) {
                    if (value.every((value): value is keyof typeof options => isKeyOf(value, options))) {
                        flag = true
                        choices[key] = value
                    }
                } else {
                    if (isObjectId(value) && value in options) {
                        flag = true
                        choices[key] = isNumber(data.numChoices) ? [value] : value
                    }
                }
            } else if (key in facade.storage.choices) {
                choices[key] = facade.storage.choices[key]
            }
        }
        if (flag) {
            dispatch.setStorage('choices', choices)
        }
    }

    return isNumber(data.numChoices) && data.numChoices > 1
        ? <ListMenu
            type='enum'
            className={styles.dropdown}
            itemClassName={styles.dropdownItem}
            values={value}
            defaultValue={keysOf(options).find(x => !value.includes(x))!}
            options={options}
            onChange={handleChange}
            disabled={value.length >= data.numChoices}/>
        : <DropdownMenu
            value={value[0]}
            values={options}
            className={styles.dropdown}
            itemClassName={styles.dropdownItem}
            onChange={handleChange}/>
}

const SubclassChoiceItem: React.FC<SubclassChoiceItemProps> = ({ facade, id, data }) => {
    const [, dispatch] = useContext(Context)
    const [subclasses] = useSubFiles(id, DocumentType.Subclass)
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
        const choices: Record<string, unknown> = {}
        let flag = false
        for (const key of keysOf(facade.classes)) {
            if (key === id) {
                flag = true
                choices[key] = value
            } else if (key in facade.storage.subclasses) {
                choices[key] = facade.storage.subclasses[key]
            }
        }
        if (flag) {
            dispatch.setStorage('subclasses', choices)
        }
        if (value in options) {
            dispatch.setStorage('subclasses', { ...facade.storage.subclasses, [id]: value })
        }
    }

    const handleClear = (): void => {
        const { [id]: _, ...other } = facade.storage.subclasses
        dispatch.setStorage('subclasses', other)
    }

    if (subclasses.length < 1) {
        return null
    }

    return (
        <div className={styles.modifierChoice}>
            <Tooltip title={<LocalizedText id='render-subclass-choice-tooltips' args={[data.name]}/>}>
                <b><LocalizedText id='render-subclass-choice' args={[data.name]}/></b>
            </Tooltip>
            <DropdownMenu<ObjectId>
                value={value}
                values={options}
                className={styles.dropdown}
                itemClassName={styles.dropdownItem}
                onChange={handleChange}/>
            <Tooltip title={<LocalizedText id='common-clear'/>}>
                <button className='center-flex fill-height' onClick={handleClear}>
                    <ClearIcon className='small-icon'/>
                </button>
            </Tooltip>
        </div>
    )
}

const SubraceChoiceItem: React.FC<SubraceChoiceItemProps> = ({ facade, id, data }) => {
    const [, dispatch] = useContext(Context)
    const [subraces] = useSubFiles(id, DocumentType.Subrace)
    const options = useMemo<Record<ObjectId, React.ReactNode>>(() => {
        const options: Record<ObjectId, React.ReactNode> = {}
        if (data === null) {
            return options
        }

        for (let i = 0; i < subraces.length; i++) {
            const value = subraces[i]
            if (value === null) {
                continue
            }
            options[value.id] = value.getTitle()
        }
        return options
    }, [data, subraces])

    const handleChange = (value: ObjectId): void => {
        if (value in options) {
            dispatch.setStorage('subrace', value)
        }
    }

    const handleClear = (): void => {
        dispatch.setStorage('subrace', null)
    }

    if (subraces.length < 1) {
        return null
    }

    return (
        <div className={styles.modifierChoice}>
            <Tooltip title={<LocalizedText id='render-subclass-choice-tooltips' args={[data.name]}/>}>
                <b><LocalizedText id='render-subclass-choice' args={[data.name]}/></b>
            </Tooltip>
            <DropdownMenu<ObjectId>
                value={facade.storage.subrace as any}
                values={options}
                className={styles.dropdown}
                itemClassName={styles.dropdownItem}
                onChange={handleChange}/>
            <Tooltip title={<LocalizedText id='common-clear'/>}>
                <button className='center-flex fill-height' onClick={handleClear}>
                    <ClearIcon className='small-icon'/>
                </button>
            </Tooltip>
        </div>
    )
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
        case 'spell':
        case 'ability':
            content = <ModifierChoiceDocumentItem facade={facade} choiceKey={choiceKey} data={data}/>
            break
        case 'value':
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

const CharacterChoicePage: React.FC<ChoicePageProps> = ({ facade }) => {
    const choices = facade.modifier.properties.choices
    return <>
        { facade.race !== null && facade.raceData !== null &&
            <SubraceChoiceItem facade={facade} id={facade.race} data={facade.raceData}/>
        }
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

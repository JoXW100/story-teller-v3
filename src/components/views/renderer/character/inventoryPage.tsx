import { useContext, useMemo, useState } from 'react'
import { Tooltip } from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove'
import EquipIcon from '@mui/icons-material/AddModeratorSharp'
import UnequipIcon from '@mui/icons-material/RemoveModeratorSharp'
import { Context as StoryContext } from 'components/contexts/story'
import { Context } from 'components/contexts/file'
import Elements from 'components/elements'
import LocalizedText from 'components/controls/localizedText'
import CollapsibleGroup from 'components/controls/collapsibleGroup'
import DropdownMenu from 'components/controls/dropdownMenu'
import LinkInput from 'components/controls/linkInput'
import { asBooleanString, isObjectId, keysOf } from 'utils'
import { useTranslator } from 'utils/hooks/localization'
import { DocumentType } from 'structure/database'
import type CharacterFacade from 'structure/database/files/character/facade'
import type { ItemData } from 'structure/database/files/item/factory'
import type { ObjectId } from 'types'
import type { IInventoryItemData } from 'types/database/files/character'
import type { DocumentTypeMap } from 'types/database/files/factory'
import styles from '../styles.module.scss'

type CharacterInventoryPageProps = React.PropsWithRef<{
    facade: CharacterFacade
    items: Record<ObjectId, ItemData>
}>

const AllowedTypes = [DocumentType.Item] as const
const CharacterInventoryPage: React.FC<CharacterInventoryPageProps> = ({ facade, items }) => {
    const [context] = useContext(StoryContext)
    const [, dispatch] = useContext(Context)
    const [text, setText] = useState<string>('')
    const translator = useTranslator()
    const attunementOptions = useMemo(() => {
        const options: Record<ObjectId | 'none', string> = { none: 'None' }
        for (const key of keysOf(items)) {
            const item = items[key]
            if (facade.storage.inventory[key]?.equipped && item.attunement) {
                options[key] = item.name ?? '-'
            }
        }
        return options
    }, [facade.storage.inventory, items])

    const handleAdd = (value: DocumentTypeMap[DocumentType]): void => {
        setText('')
        if (value.id in facade.storage.inventory) {
            dispatch.setStorage('inventory', {
                ...facade.storage.inventory,
                [value.id]: {
                    ...(facade.storage.inventory[value.id] ?? {}),
                    quantity: (facade.storage.inventory[value.id].quantity ?? 1) + 1
                } satisfies IInventoryItemData
            })
        } else if (value.type === DocumentType.Item) {
            dispatch.setStorage('inventory', { ...facade.storage.inventory, [value.id]: {} })
        }
    }

    const handleRemove = (key: ObjectId): void => {
        if ((facade.storage.inventory[key]?.quantity ?? 0) > 1) {
            dispatch.setStorage('inventory', {
                ...facade.storage.inventory,
                [key]: {
                    ...(facade.storage.inventory[key] ?? {}),
                    quantity: facade.storage.inventory[key].quantity - 1
                } satisfies IInventoryItemData
            })
        } else {
            const { [key]: _, ...other } = facade.storage.inventory
            dispatch.setStorage('inventory', other)
        }
    }

    const handleEquip = (key: ObjectId, value: boolean): void => {
        dispatch.setStorage('inventory', {
            ...facade.storage.inventory,
            [key]: {
                ...(facade.storage.inventory[key] ?? {}),
                equipped: value
            } satisfies IInventoryItemData
        })
    }

    const handleAttunementChanged = (index: number, value: string): void => {
        const result: ObjectId[] = []
        for (let i = 0; i < facade.attunementSlots; i++) {
            const id = facade.storage.attunement[i]
            if (i === index) {
                if (isObjectId(value)) {
                    result.push(value)
                }
            } else if (id !== undefined) {
                result.push(id)
            }
        }
        dispatch.setStorage('attunement', result)
    }

    const handleTextChanged: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        dispatch.setStorage('inventoryText', e.target.value)
    }

    const handleSort = (a: ObjectId, b: ObjectId): number => {
        if (facade.storage.inventory[b]?.equipped === facade.storage.inventory[a]?.equipped) {
            return items[b].name.localeCompare(items[a].name)
        }
        return facade.storage.inventory[b]?.equipped ? -1 : 1
    }

    return (
        <>
            <CollapsibleGroup header={<LocalizedText id='renderer-inventory'/>}>
                <div className={styles.inventoryHeader}>
                    <LocalizedText className='font-bold font-smaller' id='render-inventory-equipped'/>
                    <LocalizedText className='font-bold font-smaller' id='render-inventory-name'/>
                    <LocalizedText className='font-bold font-smaller' id='render-inventory-weight'/>
                    <LocalizedText className='font-bold font-smaller' id='render-inventory-quantity'/>
                    <LocalizedText className='font-bold font-smaller' id='render-inventory-cost'/>
                </div>
                { keysOf(items).sort(handleSort).map((key) => {
                    const item = items[key]
                    const isEquipped = item.equippable && facade.storage.inventory[key]?.equipped
                    const isAttuned = facade.storage.attunement.includes(key)
                    const quantity = facade.storage.inventory[key].quantity ?? 1
                    return (
                        <div
                            key={key}
                            className={styles.inventoryItem}
                            data={asBooleanString(isEquipped)}>
                            <Tooltip title={isEquipped
                                ? <LocalizedText id='render-inventory-unequip'/>
                                : <LocalizedText id='render-inventory-equip'/>}>
                                <span>
                                    <button
                                        className='icon center-flex'
                                        onClick={() => { handleEquip(key, !isEquipped) }}
                                        disabled={!item.equippable || isAttuned}>
                                        {isEquipped ? <UnequipIcon className='small-icon'/> : item.equippable && <EquipIcon className='small-icon'/>}
                                    </button>
                                </span>
                            </Tooltip>
                            <div>
                                <b className='color-by-rarity' data={item.rarity}>{item.name}</b>
                                <span className='font-smaller'>{item.getCategoryText(translator)}</span>
                            </div>
                            <span>{String(item.weight * quantity)}</span>
                            <span>{String(quantity)}</span>
                            <span>{String(item.cost * quantity)}</span>
                            <Tooltip title={<LocalizedText id='common-remove'/>}>
                                <span>
                                    <button
                                        className='icon center-flex'
                                        onClick={() => { handleRemove(key) }}
                                        disabled={isAttuned}>
                                        <RemoveIcon className='small-icon'/>
                                    </button>
                                </span>
                            </Tooltip>
                        </div>
                    )
                })}
            </CollapsibleGroup>
            <CollapsibleGroup header={<LocalizedText id='render-inventory-attunement'/>}>
                {Array.from({ length: facade.attunementSlots }).map((_, index) => (
                    <DropdownMenu
                        key={index}
                        className={styles.inventoryAttunementDropdown}
                        exclude={facade.storage.attunement}
                        value={facade.storage.attunement[index] ?? 'none'}
                        values={attunementOptions}
                        onChange={(value) => { handleAttunementChanged(index, value) }}/>
                ))}
            </CollapsibleGroup>
            <CollapsibleGroup header={<LocalizedText id='render-inventory-other'/>}>
                <textarea
                    className={styles.inventoryInput}
                    value={facade.storage.inventoryText ?? ''}
                    onChange={handleTextChanged}/>
            </CollapsibleGroup>
            <CollapsibleGroup header={<LocalizedText id='render-inventory-add'/>}>
                <div className={styles.modifierChoice}>
                    <Elements.b>Item: </Elements.b>
                    <LinkInput
                        value={text}
                        story={context.story}
                        allowedTypes={AllowedTypes}
                        allowText={false}
                        onChange={setText}
                        onAdd={handleAdd}/>
                </div>
            </CollapsibleGroup>
        </>
    )
}

export default CharacterInventoryPage

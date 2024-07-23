import { useContext, useMemo } from 'react'
import { Context } from 'components/contexts/file'
import TextEditor from 'components/textEditor'
import GroupComponent from './components/group'
import LocalizedText from 'components/localizedText'
import TextComponent from './components/text'
import NumberComponent from './components/number'
import EnumComponent from './components/enum'
import BooleanComponent from './components/boolean'
import EditItemRecordComponent from './components/editItemRecord'
import LinkListComponent from './components/linkList'
import SelectionInputComponent from './components/selectionInput'
import { ElementDictionary } from 'components/elements'
import ItemDocument from 'structure/database/files/item'
import { DocumentType } from 'structure/database'
import { ItemType, MeleeWeaponType, RangedWeaponType, ThrownWeaponType } from 'structure/dnd'
import EffectFactory from 'structure/database/effect/factory'
import styles from './style.module.scss'
import { isEnum } from 'utils'

const ItemDocumentEditor: React.FC = () => {
    const [context, dispatch] = useContext(Context)
    const defaultEffectValue = useMemo(() => EffectFactory.create(), [])

    if (!(context.file instanceof ItemDocument)) {
        return null
    }

    const [descriptionContext] = context.file.data.createContexts(ElementDictionary)

    return (
        <div className={styles.main}>
            <GroupComponent header={<LocalizedText id='editor-header-data'/>} open>
                <TextComponent field='name' labelId='editor-name'/>
                <EnumComponent field='type' type='itemType' labelId='editor-type'/>
                { context.file.data.type === ItemType.Armor &&
                    <EnumComponent field='subtype' type='armor' labelId='editor-armorType'/>
                }
                { context.file.data.type === ItemType.Weapon &&
                    <EnumComponent field='subtype' type='weaponType' labelId='editor-weaponType'/>
                }
                <EnumComponent field='rarity' type='rarity' labelId='editor-rarity'/>
                <BooleanComponent field='attunement' labelId='editor-attunement'/>
                <NumberComponent field='weight' labelId='editor-weight'/>
                <NumberComponent field='cost' labelId='editor-cost'/>
                { context.file.data.type === ItemType.Weapon &&
                    <TextComponent field='notes' labelId='editor-notes'/>
                }
            </GroupComponent>
            { context.file.data.type === ItemType.Armor &&
                <GroupComponent header={<LocalizedText id='editor-header-details'/>} open>
                    <NumberComponent field='ac' labelId='editor-ac' />
                    <BooleanComponent field='disadvantageStealth' labelId='editor-disadvantageStealth'/>
                </GroupComponent>
            }{ context.file.data.type === ItemType.Weapon &&
                <>
                    <GroupComponent header={<LocalizedText id='editor-header-effect'/>} open>
                        <EnumComponent field='damageType' type='damageType' labelId='editor-damageType'/>
                        <SelectionInputComponent
                            field='damageScaling'
                            type='number'
                            optionsType='scaling'
                            labelId='editor-scaling'
                            fill/>
                        <EditItemRecordComponent
                            field='effects'
                            labelId='editor-effects'
                            defaultValue={defaultEffectValue}
                            page='effect'/>
                    </GroupComponent>
                    <GroupComponent header={<LocalizedText id='editor-header-condition'/>} open>
                        { isEnum(context.file.data.subtype, MeleeWeaponType) &&
                            <NumberComponent field='reach' labelId='editor-reach'/>
                        }{ isEnum(context.file.data.subtype, RangedWeaponType) &&
                            <>
                                <NumberComponent field='range' labelId='editor-range'/>
                                <NumberComponent field='rangeLong' labelId='editor-rangeLong'/>
                            </>
                        }{ isEnum(context.file.data.subtype, ThrownWeaponType) &&
                            <>
                                <NumberComponent field='reach' labelId='editor-reach'/>
                                <NumberComponent field='range' labelId='editor-range'/>
                            </>
                        }
                        <SelectionInputComponent
                            field='hitScaling'
                            type='number'
                            optionsType='scaling'
                            labelId='editor-scaling'
                            fill/>
                    </GroupComponent>
                </>
            }
            <GroupComponent header={<LocalizedText id='editor-header-charges'/>} open>
                <EditItemRecordComponent
                    field='charges'
                    defaultValue={{}}
                    labelId='editor-charges'
                    page='charges'/>
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-modifiers'/>} open>
                <LinkListComponent
                    field='modifiers'
                    labelId='editor-modifiers'
                    placeholderId='editor-modifiers-placeholder'
                    allowedTypes={[DocumentType.Modifier]}
                    fill/>
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-description'/>} open fill>
                <TextEditor
                    value={context.file.data.description}
                    className={styles.editTextEditor}
                    context={descriptionContext}
                    onMount={(token) => { dispatch.setToken('description', token) }}
                    onChange={(text, token) => {
                        dispatch.setData('description', text)
                        dispatch.setToken('description', token)
                    }}/>
            </GroupComponent>
        </div>
    )
}

export default ItemDocumentEditor

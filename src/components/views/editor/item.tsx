import { useContext, useMemo } from 'react'
import { Context } from 'components/contexts/file'
import TextEditor from 'components/controls/textEditor'
import LocalizedText from 'components/controls/localizedText'
import GroupComponent from './components/group'
import PublishComponent from './components/publish'
import TextComponent from './components/text'
import NumberComponent from './components/number'
import EnumComponent from './components/enum'
import BooleanComponent from './components/boolean'
import EditItemRecordComponent from './components/editItemRecord'
import SelectionInputComponent from './components/selectionInput'
import TextareaComponent from './components/textarea'
import ModifiersInputComponent from './components/modifiersInput'
import { ElementDictionary } from 'components/elements'
import { isEnum } from 'utils'
import ItemDocument from 'structure/database/files/item'
import { ItemType, MeleeWeaponType, RangedWeaponType, ThrownWeaponType } from 'structure/dnd'
import EffectFactory from 'structure/database/effect/factory'
import styles from './style.module.scss'

const ItemDocumentEditor: React.FC = () => {
    const [context, dispatch] = useContext(Context)
    const defaultEffectValue = useMemo(() => EffectFactory.create(), [])

    if (!(context.file instanceof ItemDocument)) {
        return null
    }

    const [descriptionContext, contentContext] = context.file.data.createContexts(ElementDictionary)

    return (
        <div className={styles.main}>
            <GroupComponent header={<LocalizedText id='editor-header-data'/>} open>
                <PublishComponent/>
                <TextComponent field='name' labelId='editor-name'/>
                <TextareaComponent field='description' labelId='editor-description' languageContext={descriptionContext}/>
                <EnumComponent field='type' type='itemType' labelId='editor-type'/>
                { context.file.data.type === ItemType.Armor &&
                    <EnumComponent field='subtype' type='armor' labelId='editor-armorType'/>
                }{ context.file.data.type === ItemType.Tool &&
                    <EnumComponent field='subtype' type='tool' labelId='editor-toolType'/>
                }{ context.file.data.type === ItemType.Weapon &&
                    <EnumComponent field='subtype' type='weaponType' labelId='editor-weaponType'/>
                }
                <EnumComponent field='rarity' type='rarity' labelId='editor-rarity'/>
                <BooleanComponent field='attunement' labelId='editor-attunement'/>
                <NumberComponent field='weight' labelId='editor-weight' allowDecimal/>
                <NumberComponent field='cost' labelId='editor-cost' allowDecimal/>
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
                <ModifiersInputComponent field='modifiers' fill/>
            </GroupComponent>
            <GroupComponent header={<LocalizedText id='editor-header-content'/>} open fill>
                <TextEditor
                    value={context.file.data.content}
                    className={styles.editTextEditor}
                    context={contentContext}
                    onChange={(text) => { dispatch.setData('content', text) }}/>
            </GroupComponent>
        </div>
    )
}

export default ItemDocumentEditor

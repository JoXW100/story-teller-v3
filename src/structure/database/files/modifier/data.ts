import { isString } from 'utils'
import type ModifierDocument from '.'
import type Modifier from './modifier'
import type { ModifierType } from './common'
import type Condition from 'structure/database/condition'
import ConditionFactory from 'structure/database/condition/factory'
import EmptyToken from 'structure/language/tokens/empty'
import type { Simplify } from 'types'
import type { TokenContext } from 'types/language'
import type { DataPropertyMap } from 'types/database'
import type { IEditorChoiceData, IModifierDataBase } from 'types/database/files/modifier'
import type { IConditionProperties } from 'types/database/condition'
import type { ElementDefinitions } from 'structure/elements/dictionary'

abstract class ModifierDataBase implements IModifierDataBase {
    public abstract readonly type: ModifierType
    public readonly name: string
    public readonly description: string
    public readonly condition: Condition

    public constructor(modifier: Simplify<IModifierDataBase>) {
        this.name = modifier.name ?? ModifierDataBase.properties.name.value
        this.description = modifier.description ?? ModifierDataBase.properties.description.value
        this.condition = ModifierDataBase.properties.condition.value
        if (modifier.condition !== null && modifier.condition !== undefined) {
            this.condition = ConditionFactory.create(modifier.condition)
        }
    }

    public static properties: Omit<DataPropertyMap<IModifierDataBase, ModifierDataBase>, 'type'> = {
        name: {
            value: '',
            validate: isString
        },
        description: {
            value: '',
            validate: isString
        },
        condition: {
            get value() { return ConditionFactory.create() },
            validate: ConditionFactory.validate,
            simplify: ConditionFactory.simplify
        }
    }

    public createContexts(elements: ElementDefinitions): [TokenContext] {
        const descriptionContext = {
            title: new EmptyToken(elements, this.name),
            name: new EmptyToken(elements, this.name)
        }
        return [descriptionContext]
    }

    public checkCondition(data: Partial<IConditionProperties>): boolean {
        return this.condition === null || this.condition.evaluate(data)
    }

    public stringify(): string {
        const stringifiedObject: string = JSON.stringify(this)
        return stringifiedObject
    }

    public getEditorChoiceData(): IEditorChoiceData | null {
        return null
    }

    public abstract apply(data: Modifier, self: ModifierDocument): void
}

export default ModifierDataBase

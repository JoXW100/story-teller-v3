import type { ModifierType } from './common'
import type Modifier from './modifier'
import { isString } from 'utils'
import type Condition from 'structure/database/condition'
import ConditionFactory, { simplifyCondition } from 'structure/database/condition/factory'
import EmptyToken from 'structure/language/tokens/empty'
import type { Simplify } from 'types'
import type { TokenContext } from 'types/language'
import type { IProperties } from 'types/editor'
import type { DataPropertyMap } from 'types/database'
import type { IModifierDataBase } from 'types/database/files/modifier'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import StoryScript from 'structure/language/storyscript'

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
            simplify: simplifyCondition
        }
    }

    public createContexts(elements: ElementDefinitions): [TokenContext] {
        const descriptionContext = {
            title: new EmptyToken(elements, this.name),
            name: new EmptyToken(elements, this.name)
        }
        return [descriptionContext]
    }

    public static tokenizeDescription(self: ModifierDataBase, elements: ElementDefinitions): React.ReactNode {
        const [description] = self.createContexts(elements)
        return StoryScript.tokenize(elements, self.description, description).root.build()
    }

    public checkCondition(data: Partial<IProperties>): boolean {
        return this.condition === null || this.condition.evaluate(data)
    }

    public stringify(): string {
        const stringifiedObject: string = JSON.stringify(this)
        return stringifiedObject
    }

    public abstract apply(modifier: Modifier, key: string): void
}

export default ModifierDataBase

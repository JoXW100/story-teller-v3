export function expectNotToBeNull<T>(value: T | null): value is T {
    expect(value).not.toBeNull()
    return value !== null
}

export function expectThat<T extends boolean>(value: T): T {
    expect(value)
    return value
}

export function expectTypeToBe<A>(value: unknown, validator: (val: unknown) => val is A): value is A {
    const result = validator(value)
    expect(result)
    return result
}

export function expectInstanceOf<T, C extends abstract new (...args: any) => T>(value: T, constructor: C): value is InstanceType<C> {
    expect(value).toBeInstanceOf(constructor)
    return value instanceof constructor
}

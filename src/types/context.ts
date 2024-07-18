export type ContextProvider<A extends Record<string, any>, B extends Record<string, any>> = [
    data: A,
    dispatch: B
]

export interface DispatchAction<T extends string, D> {
    type: T
    data: D
}

export interface DispatchActionWithDispatch<T extends string, D, A> {
    type: T
    data: D
    dispatch: React.Dispatch<A>
}

export interface DispatchActionNoData<T extends string> {
    type: T
}

export interface ISetFieldData<T extends string = string> {
    field: T
    value: any
}

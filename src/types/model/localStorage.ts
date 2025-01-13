export interface ILocalStorageModel {
    set(value: string, key?: string): void
    get(key?: string): string | null
}

export interface PersistedState {
    productIds: string[]
}
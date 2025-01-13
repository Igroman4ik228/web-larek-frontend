import { PersistedState } from "./localStorage";

export interface IBasketModel {
    readonly productIds: string[];
    readonly totalPrice: number;
    readonly isValid: boolean;
    add(id: string): void;
    remove(id: string): void;
    has(id: string): boolean;
    getIndex(id: string): number;
    clear(): void;
    // Сохранение/восстановление корзины в localStorage
    persistState(): void;
    restoreState(): void;
    validateState(value: PersistedState): boolean
}

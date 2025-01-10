export interface IBasketModel {
    readonly items: string[];
    readonly totalPrice: number;
    add(id: string): void;
    remove(id: string): void;
    has(id: string): boolean;
    getIndex(id: string): number;
    validateTotalPrice(): boolean;
    clear(): void;
}

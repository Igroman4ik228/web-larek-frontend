export interface IBasketModel {
    readonly productIds: string[];
    readonly totalPrice: number;
    add(id: string): void;
    remove(id: string): void;
    has(id: string): boolean;
    getIndex(id: string): number;
    clear(): void;
}

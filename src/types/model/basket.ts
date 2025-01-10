export interface IBasketModel {
    readonly items: string[];
    readonly totalPrice: number;
    add(id: string): void;
    remove(id: string): void;
    has(id: string): boolean;
    clear(): void;
}

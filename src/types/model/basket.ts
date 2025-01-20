export interface IBasketProductData {
    title: string;
    price: number | null;
}

export interface IBasketProduct extends IBasketProductData {
    id: string;
}

export interface IBasketModel {
    readonly products: IBasketProduct[];
    readonly totalPrice: number;
    readonly isValid: boolean;
    add(product: IBasketProduct): void;
    remove(productId: string): void;
    has(productId: string): boolean;
    getIndex(productId: string): number;
    clear(): void;
}
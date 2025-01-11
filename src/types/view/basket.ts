export interface IBasketItemData {
    index: number;
    id: string;
    title: string;
    price: number | null;
}

export interface IBasketData {
    items: HTMLElement[];
    totalPrice: number;
}
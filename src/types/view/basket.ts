export interface IBasketItemView {
    index: number;
    id: string;
    title: string;
    price: number | null;
}

export interface IBasketView {
    items: HTMLElement[];
    totalPrice: number;
}
export interface IBaseCardData {
    title: string;
    price: number | null;
}

export enum CategoryColor {
    "софт-скил" = "soft",
    "хард-скил" = "hard",
    "кнопка" = "button",
    "дополнительное" = "additional",
    "другое" = "other",
}

export interface ICategory {
    name: string;
    colorClass: string;
}

export interface ICardData extends IBaseCardData {
    category: ICategory;
    image: string;
}

export interface ICardPreviewData extends ICardData {
    description: string;
    hasInBasket: boolean;
}

export interface ICardBasketData extends IBaseCardData {
    index: number;
    id: string;
}
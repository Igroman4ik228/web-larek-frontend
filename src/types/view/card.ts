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

export interface IBaseCardData {
    category: ICategory;
    title: string;
    image: string;
}

export interface ICardData extends IBaseCardData {
    price: number | null;
}

export interface ICardPreviewData extends IBaseCardData {
    price: number | null;
    description: string;
    hasInBasket: boolean;
}
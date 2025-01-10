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

export interface IBaseCardView {
    category: ICategory;
    title: string;
    image: string;
    price: number | null;
}

export interface ICardPreviewView extends IBaseCardView {
    description: string;
    hasInBasket: boolean;
}
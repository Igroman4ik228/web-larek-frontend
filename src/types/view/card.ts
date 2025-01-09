export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard {
    title: string;
    image: string;
    category: { name: string, color: string };
    price: number;
}

export enum CategoryColor {
    "софт-скил" = "soft",
    "хард-скил" = "hard",
    "кнопка" = "button",
    "дополнительное" = "additional",
    "другое" = "other",
}

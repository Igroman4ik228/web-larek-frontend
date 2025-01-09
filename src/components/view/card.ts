import { ICard, ICardActions } from "../../types/view/card";
import { formatCurrency } from "../../utils";
import { ensureElement } from "../../utils/html";
import { Component } from "../base/component";

export class CardView extends Component<ICard> {
    protected _title: HTMLTitleElement;
    protected _image: HTMLImageElement;
    protected _button: HTMLButtonElement;
    protected _category: HTMLSpanElement;
    protected _price: HTMLSpanElement;

    constructor(protected container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._button = container.querySelector(".card");
        this._title = ensureElement<HTMLTitleElement>(".card__title", container);
        this._image = ensureElement<HTMLImageElement>(".card__image", container);
        this._category = ensureElement<HTMLSpanElement>(".card__category", container);
        this._price = ensureElement<HTMLSpanElement>(".card__price", container);

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        if (this._title) return this._title.textContent || '';
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set category(
        { name: value, color: categoryColor }: { name: string, color: string }
    ) {
        this.setText(this._category, value);
        this._category.classList.replace("card__category_soft", `card__category_${categoryColor}`);
    }

    set price(value: number | null) {
        if (!value) {
            this.setText(this._price, "Бесценно");
            return;
        };
        this.setText(this._price, formatCurrency(value));
    }
}

export interface ICardPreview {
    title: string;
    image: string;
    category: { name: string, color: string };
    description: string;
    price: number;
}

export class CardPreviewView extends Component<ICardPreview> {
    protected _title: HTMLTitleElement;
    protected _image: HTMLImageElement;
    protected _button: HTMLButtonElement;
    protected _category: HTMLSpanElement;
    protected _price: HTMLSpanElement;
    protected _description: HTMLParagraphElement;

    constructor(protected container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._button = container.querySelector(".card__button");
        this._title = ensureElement<HTMLTitleElement>(".card__title", container);
        this._image = ensureElement<HTMLImageElement>(".card__image", container);
        this._category = ensureElement<HTMLSpanElement>(".card__category", container);
        this._price = ensureElement<HTMLSpanElement>(".card__price", container);
        this._description = ensureElement<HTMLParagraphElement>(".card__text", container);

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        if (this._title) return this._title.textContent || '';
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set category(
        { name: value, color: categoryColor }: { name: string, color: string }
    ) {
        this.setText(this._category, value);
        this._category.classList.replace("card__category_soft", `card__category_${categoryColor}`);
    }

    set price(value: number | null) {
        if (!value) {
            this.setText(this._price, "Бесценно");
            return;
        };
        this.setText(this._price, formatCurrency(value));
    }
}
import { IOnClickEvent } from "../../types";
import { IBaseCardView, ICardPreviewView, ICategory } from "../../types/view/card";
import { formatCurrency } from "../../utils";
import { ensureElement } from "../../utils/html";
import { Component } from "../base/component";

export abstract class BaseCardView<T extends IBaseCardView> extends Component<T> {
    protected _category: HTMLElement;
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _price: HTMLElement;

    constructor(readonly container: HTMLElement) {
        super(container);

        this._category = ensureElement<HTMLElement>(".card__category", container);
        this._title = ensureElement<HTMLElement>(".card__title", container);
        this._image = ensureElement<HTMLImageElement>(".card__image", container);
        this._price = ensureElement<HTMLElement>(".card__price", container);
    }

    set category(item: ICategory) {
        this.setText(this._category, item.name);

        const classList = this._category.classList;
        Array.from(classList)
            .filter(cls => cls.startsWith("card__category_"))
            .forEach(cls => classList.remove(cls));

        classList.add(`card__category_${item.colorClass}`);
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set price(value: number) {
        this.setText(this._price, formatCurrency(value));
    }
}

export class CardView extends BaseCardView<IBaseCardView> {
    protected _buttonPreview: HTMLButtonElement | null;

    constructor(readonly container: HTMLElement, actions: IOnClickEvent) {
        super(container);

        this._buttonPreview = container.querySelector(".gallery__item");

        if (!actions.onClick) return;

        if (this._buttonPreview)
            this._buttonPreview.addEventListener("click", actions.onClick);
        else
            container.addEventListener("click", actions.onClick);
    }
}

export class CardPreviewView extends BaseCardView<ICardPreviewView> {
    protected _description: HTMLElement;
    protected _buttonBuy: HTMLButtonElement;

    constructor(readonly container: HTMLElement, actions: IOnClickEvent) {
        super(container);

        this._description = ensureElement<HTMLElement>(".card__text", container);
        this._buttonBuy = ensureElement<HTMLButtonElement>(".card__button", container);

        if (actions.onClick) {
            this._buttonBuy.addEventListener("click", actions.onClick);
        }
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    set hasInBasket(value: boolean) {
        if (value)
            this.setText(this._buttonBuy, "Убрать из корзины");
        else
            this.setText(this._buttonBuy, "В корзину");
    }
}
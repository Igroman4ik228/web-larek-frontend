import { BasketItemRemoveEvent, IOnClickEvent, ViewStates } from "../../types";
import { IEvents } from "../../types/base/events";
import { IBaseCardData, ICardBasketData, ICardData, ICardPreviewData, ICategory } from "../../types/view/card";
import { formatCurrency } from "../../utils";
import { ensureElement } from "../../utils/html";
import { Component } from "../base/component";

export class BaseCardView<T extends IBaseCardData> extends Component<T> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this._title = ensureElement<HTMLElement>(".card__title", container);
        this._price = ensureElement<HTMLElement>(".card__price", container);
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number | null) {
        this.setText(this._price, formatCurrency(value));
    }
}

export class CardView extends BaseCardView<ICardData> {
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;

    protected _buttonPreview: HTMLButtonElement | null;

    constructor(container: HTMLElement, actions?: IOnClickEvent) {
        super(container);

        this._category = ensureElement<HTMLElement>(".card__category", container);
        this._image = ensureElement<HTMLImageElement>(".card__image", container);

        this._buttonPreview = container.querySelector(".gallery__item");

        if (!actions?.onClick) return;

        if (this._buttonPreview)
            this._buttonPreview.addEventListener("click", actions.onClick);
        else
            container.addEventListener("click", actions.onClick);
    }

    set category(item: ICategory) {
        this.setText(this._category, item.name);

        const classList = this._category.classList;
        Array.from(classList)
            .filter(cls => cls.startsWith("card__category_"))
            .forEach(cls => classList.remove(cls));

        classList.add(`card__category_${item.colorClass}`);
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }
}

export class CardPreviewView extends BaseCardView<ICardPreviewData> {
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;
    protected _description: HTMLElement;
    protected _buttonBuy: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: IOnClickEvent) {
        super(container);

        this._category = ensureElement<HTMLElement>(".card__category", container);
        this._image = ensureElement<HTMLImageElement>(".card__image", container);
        this._description = ensureElement<HTMLElement>(".card__text", container);
        this._buttonBuy = ensureElement<HTMLButtonElement>(".card__button", container);

        if (actions?.onClick)
            this._buttonBuy.addEventListener("click", actions.onClick);
    }

    set category(item: ICategory) {
        this.setText(this._category, item.name);

        const classList = this._category.classList;
        classList.forEach(cls => {
            if (cls.startsWith("card__category_")) classList.remove(cls);
        });

        classList.add(`card__category_${item.colorClass}`);
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    set hasInBasket(value: boolean) {
        this.setText(this._buttonBuy, value ? "Убрать из корзины" : "В корзину");
    }

    set price(value: number | null) {
        this.setDisabled(this._buttonBuy, value === null);
        this.setText(this._price, formatCurrency(value));
    }
}

export class CardBasketView extends BaseCardView<ICardBasketData> {
    protected _index: HTMLElement;
    protected _removeButton: HTMLButtonElement;

    protected _id: string | undefined;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this._index = ensureElement<HTMLElement>(".basket__item-index", container);
        this._removeButton = ensureElement<HTMLButtonElement>(".basket__item-delete", container);

        this._removeButton.addEventListener("click", () => {
            if (!this._id) return;
            events.emit<BasketItemRemoveEvent>(ViewStates.basketItemRemove, { productId: this._id })
        });
    }

    set index(value: number) {
        this.setText(this._index, String(value + 1));
    }

    set id(value: string) {
        this._id = value;
    }
}
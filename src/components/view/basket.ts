import { IOnClickEvent, ViewStates } from "../../types";
import { IEvents } from "../../types/base/events";
import { IBasketItemView, IBasketView } from "../../types/view/basket";
import { formatCurrency } from "../../utils";
import { ensureElement } from "../../utils/html";
import { Component } from "../base/component";

export class BasketItemView extends Component<IBasketItemView> {
    protected _index: HTMLElement;
    protected _price: HTMLElement;
    protected _title: HTMLElement;
    protected _removeButton: HTMLButtonElement;

    protected _id = "";

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this._index = ensureElement<HTMLElement>(".basket__item-index", container);
        this._title = ensureElement<HTMLElement>(".card__title", container);
        this._price = ensureElement<HTMLElement>(".card__price", container);
        this._removeButton = ensureElement<HTMLButtonElement>(".basket__item-delete", container);

        this._removeButton.addEventListener("click", () =>
            events.emit(ViewStates.basketItemRemove, { id: this._id })
        );
    }

    set index(value: number) {
        this.setText(this._index, String(value + 1));
    }

    set id(value: string) {
        this._id = value;
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number | null) {
        this.setText(this._price, formatCurrency(value));
    }
}

export class BasketView extends Component<IBasketView> {
    protected _containerForItems: HTMLElement;
    protected _totalPrice: HTMLElement;
    protected _submit: HTMLButtonElement;

    constructor(container: HTMLElement, actions: IOnClickEvent) {
        super(container);

        this._containerForItems = ensureElement<HTMLElement>(".basket__list", container);
        this._totalPrice = ensureElement<HTMLElement>(".basket__price", container);
        this._submit = ensureElement<HTMLButtonElement>(".button", container);


        if (actions.onClick) {
            this._submit.addEventListener("click", actions.onClick);
        }
    }

    set items(value: HTMLElement[]) {
        this._containerForItems.replaceChildren(...value);
    }

    set totalPrice(value: number) {
        this.setDisabled(this._submit, value === 0);
        this.setText(this._totalPrice, formatCurrency(value));
    }
}
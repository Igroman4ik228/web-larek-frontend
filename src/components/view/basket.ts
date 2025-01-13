import { IOnClickEvent, ViewStates } from "../../types";
import { IEvents } from "../../types/base/events";
import { IBasketData, IBasketItemData } from "../../types/view/basket";
import { formatCurrency } from "../../utils";
import { ensureElement, setElementChildren } from "../../utils/html";
import { Component } from "../base/component";

export class BasketItemView extends Component<IBasketItemData> {
    protected _index: HTMLElement;
    protected _price: HTMLElement;
    protected _title: HTMLElement;
    protected _removeButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this._index = ensureElement<HTMLElement>(".basket__item-index", container);
        this._title = ensureElement<HTMLElement>(".card__title", container);
        this._price = ensureElement<HTMLElement>(".card__price", container);
        this._removeButton = ensureElement<HTMLButtonElement>(".basket__item-delete", container);

        this._removeButton.addEventListener("click", () =>
            events.emit(ViewStates.basketItemRemove, { id: this.id })
        );
    }

    set index(value: number) {
        this.setText(this._index, String(value + 1));
    }

    set id(value: string) {
        this.id = value;
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number | null) {
        this.setText(this._price, formatCurrency(value));
    }
}

export class BasketView extends Component<IBasketData> {
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
        setElementChildren(this._containerForItems, value);
    }

    set totalPrice(value: number) {
        this.setText(this._totalPrice, formatCurrency(value));
    }

    set valid(value: boolean) {
        this.setDisabled(this._submit, !value);
    }
}
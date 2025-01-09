import { IEvents } from "../../types/base/events";
import { formatCurrency } from "../../utils";
import { Component } from "../base/component";

interface ICartItem {
    id: string;
    title: string;
    price: number;
}

export class CartItemView extends Component<ICartItem> {
    protected _title: HTMLSpanElement;
    protected _price: HTMLSpanElement;
    protected _removeButton: HTMLButtonElement;

    protected id: string;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container);

        this._title = container.querySelector(".card__title");
        this._price = container.querySelector(".card__price");
        this._removeButton = container.querySelector(".basket__item-delete");

        this._removeButton.addEventListener("click", () =>
            this.events.emit("view:cart-remove", { id: this.id })
        );
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number | null) {
        if (!value) {
            this.setText(this._price, "Бесценно");
            return;
        };
        this.setText(this._price, formatCurrency(value));
    }
}

interface ICart {
    items: HTMLElement[];
    totalPrice: number;
}

export class CartView extends Component<ICart> {
    protected _container: HTMLElement;
    protected _totalPrice: HTMLElement;

    constructor(protected container: HTMLElement) {
        super(container);

        this._container = container.querySelector(".basket__list");
        this._totalPrice = container.querySelector(".basket__price");
    }

    set items(items: HTMLElement[]) {
        this._container.replaceChildren(...items);
    }

    set totalPrice(value: number) {
        this.setText(this._totalPrice, formatCurrency(value));
    }
}
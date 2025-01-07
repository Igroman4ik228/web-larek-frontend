import { Component } from "../base/component";
import { IEvents } from "../base/events";

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

        // Получаем элементы внутри контейнера
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

    set price(value: number) {
        this.setText(this._price, String(value));
    }
}

interface ICart {
    items: HTMLElement[];
    totalPrice: number;
}

export class CartView extends Component<ICart> {
    constructor(protected container: HTMLElement) { super(container); }

    set items(items: HTMLElement[]) {
        this.container.replaceChildren(...items);
    }
}
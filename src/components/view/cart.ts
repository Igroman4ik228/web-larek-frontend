import { IEvents } from "../base/events";
import { IView } from "../base/view";


export class CartItemView implements IView {
    // Элементы внутри контейнера
    protected title: HTMLSpanElement;
    protected price: HTMLSpanElement;
    protected removeButton: HTMLButtonElement;

    // Данные на будущее
    protected id: string;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        // Получаем элементы внутри контейнера
        this.title = container.querySelector(".card__title");
        this.price = container.querySelector(".card__price");
        this.removeButton = container.querySelector(".basket__item-delete");

        this.removeButton.addEventListener("click", () =>
            this.events.emit("view:cart-remove", { id: this.id })
        );
    }

    render(data: { id: string, title: string, price: number }): HTMLElement {
        if (data) {
            this.id = data.id;
            this.title.textContent = data.title;
            this.price.textContent = data.price.toString();
        }
        return this.container;
    }
}


export class CartView implements IView {
    constructor(protected container: HTMLElement) { }
    render(data: { items: HTMLElement[] }): HTMLElement {
        if (data) {
            this.container.replaceChildren(...data.items);
        }
        return this.container;
    }
}
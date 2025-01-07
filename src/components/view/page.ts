import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";

interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

export class PageView extends Component<IPage> {
    protected _wrapper: HTMLElement;
    protected _catalog: HTMLElement;
    protected _counter: HTMLElement;
    protected _cart: HTMLElement;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container);

        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._catalog = ensureElement<HTMLElement>('.gallery');
        this._counter = ensureElement<HTMLElement>('.header__basket-counter');
        this._cart = ensureElement<HTMLElement>('.header__basket');


        this._cart.addEventListener('click', () => {
            this.events.emit('view:cart-open');
        });
    }

    set counter(value: number) {
        this.setText(this._counter, String(value));
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}
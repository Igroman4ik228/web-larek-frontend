import { ViewStates } from "../../types";
import { IEvents } from "../../types/base/events";
import { IPageData } from "../../types/view/page";
import { ensureElement } from "../../utils/html";
import { Component } from "../base/component";

export class PageView extends Component<IPageData> {
    protected _counter: HTMLElement;
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLElement;


    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this._counter = ensureElement<HTMLElement>(".header__basket-counter");
        this._catalog = ensureElement<HTMLElement>(".gallery");
        this._wrapper = ensureElement<HTMLElement>(".page__wrapper");
        this._basket = ensureElement<HTMLElement>(".header__basket");

        this._basket.addEventListener("click", () => {
            events.emit(ViewStates.basketOpen);
        });
    }

    set counter(value: number) {
        this.setText(this._counter, String(value));
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    set locked(value: boolean) {
        this.toggleClass(this._wrapper, "page__wrapper_locked", value);
    }
}
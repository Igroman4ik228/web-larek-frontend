import { ViewStates } from "../../types";
import { IEvents } from "../../types/base/events";
import { IOrderContactData, IOrderPaymentData, PaymentMethod } from "../../types/view/order";
import { ensureElement } from "../../utils/html";
import { FormView } from "./form";

export class OrderPaymentView extends FormView<IOrderPaymentData> {
    protected _online: HTMLButtonElement;
    protected _cash: HTMLButtonElement;
    protected _address: HTMLInputElement;

    constructor(protected readonly container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._online = ensureElement<HTMLButtonElement>("button[name=card]", this.container);
        this._cash = ensureElement<HTMLButtonElement>("button[name=cash]", this.container);
        this._address = ensureElement<HTMLInputElement>("input[name=address]", this.container);

        this._online.addEventListener("click", () =>
            events.emit(ViewStates.orderPaymentChange, { field: "payment", value: "online" })
        );
        this._cash.addEventListener("click", () =>
            events.emit(ViewStates.orderPaymentChange, { field: "payment", value: "cash" })
        );
    }

    set payment(value: PaymentMethod) {
        switch (value) {
            case "cash":
                this._cash.classList.add("button_alt-active");
                this._online.classList.remove("button_alt-active");
                break;
            case "online":
                this._online.classList.add("button_alt-active");
                this._cash.classList.remove("button_alt-active");
                break;
        }
    }

    set address(value: string) {
        this._address.value = value;
    }
}

export class OrderContactView extends FormView<IOrderContactData> {
    protected _email: HTMLButtonElement;
    protected _phone: HTMLInputElement;

    constructor(protected readonly container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._email = ensureElement<HTMLButtonElement>("input[name=email]", this.container);
        this._phone = ensureElement<HTMLInputElement>("input[name=phone]", this.container);
    }

    set email(value: string) {
        this._email.value = value;
    }

    set phone(value: string) {
        this._phone.value = value;
    }
}
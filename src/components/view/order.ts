import { IEvents } from "../../types/base/events";
import { IOrderContactData, IOrderPaymentData, PaymentMethod } from "../../types/view/order";
import { ensureElement } from "../../utils/html";
import { FormView } from "./common/form";

interface IOrderPaymentEvents {
    onClickCash: () => void;
    onClickOnline: () => void;
}

export class OrderPaymentView extends FormView<IOrderPaymentData> {
    protected _online: HTMLButtonElement;
    protected _cash: HTMLButtonElement;
    protected _address: HTMLInputElement;

    constructor(protected readonly container: HTMLFormElement, events: IEvents, actions: IOrderPaymentEvents) {
        super(container, events);

        this._online = ensureElement<HTMLButtonElement>("button[name=card]", this.container);
        this._cash = ensureElement<HTMLButtonElement>("button[name=cash]", this.container);
        this._address = ensureElement<HTMLInputElement>("input[name=address]", this.container);

        if (actions.onClickOnline) {
            this._online.addEventListener("click", actions.onClickOnline);
        }

        if (actions.onClickCash) {
            this._cash.addEventListener("click", actions.onClickCash);
        }
    }

    set payment(value: PaymentMethod) {
        if (value === "cash") {
            this._cash.classList.add("button_alt-active");
            this._online.classList.remove("button_alt-active");
        }
        else if (value === "online") {
            this._online.classList.add("button_alt-active");
            this._cash.classList.remove("button_alt-active");
        }
        else {
            this._online.classList.remove("button_alt-active");
            this._cash.classList.remove("button_alt-active");
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
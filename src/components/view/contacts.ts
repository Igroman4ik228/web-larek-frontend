import { IEvents } from "../../types/base/events";
import { IContactData } from "../../types/view/contacts";
import { ensureElement } from "../../utils/html";
import { FormView } from "./common/form";

export class ContactView extends FormView<IContactData> {
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
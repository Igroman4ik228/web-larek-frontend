import { IEvents } from "../../types/base/events";
import { IOrderContact, IOrderPayment, PaymentMethod } from "../../types/model/larekApi";
import { Form } from "./common/form";

export class OrderPaymentView extends Form<IOrderPayment> {

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set payment(value: PaymentMethod) {
        (this.container.elements.namedItem("payment") as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem("email") as HTMLInputElement).value = value;
    }
}

export class OrderContactView extends Form<IOrderContact> {

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set phone(value: PaymentMethod) {
        (this.container.elements.namedItem("phone") as HTMLInputElement).value = value;
    }

    set address(value: string) {
        (this.container.elements.namedItem("address") as HTMLInputElement).value = value;
    }
}
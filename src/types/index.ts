import { IContactData } from "./view/contacts";
import { IPaymentData } from "./view/payment";

export interface IOnClickEvent {
    onClick: (event: MouseEvent) => void;
}

export enum ModalStates {
    open = "modal:open",
    close = "modal:close",
}

export enum ViewStates {
    basketOpen = "view:basket-open",
    basketItemRemove = "view:basket-item-remove",
    cardSelect = "view:card-select",
    cardOrder = "view:card-order",
    basketSubmit = "view:basket-submit",
    orderPaymentSubmit = "view:order-submit",
    orderPaymentChange = "view:order.payment-change",
    orderContactsSubmit = "view:contacts-submit",
}

export enum ModelStates {
    catalogChange = "model:catalog-change",
    basketChange = "model:basket-change",
    paymentMethodChange = "model:order-change",
    formErrorChange = "model:form-error-change",
    successOpen = "model:success-open",
}

export type SuccessOpenEvent = {
    totalPrice: number;
}

export type BasketItemRemoveEvent = {
    productId: string;
}

export type CardSelectEvent = {
    productId: string;
}

export type CardOrderEvent = {
    productId: string;
}

export type FormFieldChangeEvent = {
    field: keyof UserForm;
    value: string;
}

export type UserForm = IPaymentData & IContactData;

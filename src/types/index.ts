import { IProduct } from "./model/larekApi";
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
    basketProductRemove = "view:basket-product-remove",
    cardSelect = "view:card-select",
    basketProductAdd = "view:basket-product-add",
    basketSubmit = "view:basket-submit",
    orderPaymentSubmit = "view:order-submit",
    orderPaymentChange = "view:order.payment-change",
    orderContactsSubmit = "view:contacts-submit",
}

export enum ModelStates {
    catalogChange = "model:catalog-change",
    basketChange = "model:basket-change",
    userDataChange = "model:user-data-change",
    formErrorChange = "model:form-error-change",
    successOpen = "model:success-open",
}

export type SuccessOpenEvent = {
    totalPrice: number;
}

export type BasketProductRemoveEvent = {
    productId: string;
}

export type CardSelectEvent = {
    productId: string;
}

export type BasketProductAddEvent = {
    product: IProduct;
}

export type FormFieldChangeEvent = {
    field: keyof UserDataForm;
    value: string;
}

export type UserDataForm = IPaymentData & IContactData;

export type ValidateResult = {
    isValid: boolean,
    errors: string[]
}
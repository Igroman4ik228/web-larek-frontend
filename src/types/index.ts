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
    basketSubmit = "model:basket-submit",
    cardSelect = "view:card-select",
    cardOrder = "view:card-order",
    orderPaymentSubmit = "view:order-submit",
    orderContactSubmit = "view:contacts-submit",
}

export enum ModelStates {
    catalogChange = "model:catalog-change",
    basketChange = "model:basket-change",
    orderCreate = "model:order-create",
    formPaymentErrorChange = "model:form-payment-error-change",
    formContactErrorChange = "model:form-contact-error-change",
}

export type EventPayload = {
    [ViewStates.cardOrder]: { id: string };
    [ViewStates.basketItemRemove]: { id: string };
};
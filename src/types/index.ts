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
}

export enum ModelStates {
    catalogChange = "model:catalog-change",
    basketChange = "model:basket-change",
    orderCreate = "model:order-create",
    formErrorChange = "model:form-error-change",
}
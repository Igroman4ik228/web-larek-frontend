export type PaymentMethod = "online" | "cash";

export interface IOrderPaymentData {
    payment: PaymentMethod;
    address: string;
}

export interface IOrderContactData {
    email: string;
    phone: string;
}

export type IOrderForm = IOrderPaymentData & IOrderContactData;

export interface IOrderPaymentEvents {
    onClickCash: () => void;
    onClickOnline: () => void;
}

export enum ErrorMessages {
    Payment = "Необходимо выбрать способ оплаты",
    Address = "Необходимо указать адрес",
    Email = "Необходимо указать email",
    Phone = "Необходимо указать телефон"
}
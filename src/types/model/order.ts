import { OrderForm } from "../view/order";

// todo payment: "online" | "cash"
export interface IOrderData {
    payment: string;
    address: string;
    email: string;
    phone: string;
}

export type FormErrors = Partial<Record<keyof OrderForm, string>>;

export interface IOrderModel {
    readonly order: IOrderData;
    readonly formErrors: FormErrors;
    setOrderField(field: keyof OrderForm, value: string): void;
    validateOrder(fields?: (keyof OrderForm)[]): boolean;
}

export enum ErrorMessages {
    Payment = "Необходимо выбрать способ оплаты",
    Address = "Необходимо указать адрес",
    Email = "Необходимо указать email",
    Phone = "Необходимо указать телефон"
}
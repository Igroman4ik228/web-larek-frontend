import { OrderForm } from "../view/order";
import { IOrder } from "./larekApi";

export interface IOrderModel {
    readonly order: IOrder;
    readonly formErrors: FormErrors;
    setOrderField(field: keyof OrderForm, value: string): void;
    validateOrder(fields?: (keyof OrderForm)[]): boolean;
    createOrder: () => Promise<void>;
}

export type FormErrors = Partial<Record<keyof OrderForm, string>>;

export enum ErrorMessages {
    Payment = "Необходимо выбрать способ оплаты",
    Address = "Необходимо указать адрес",
    Email = "Необходимо указать email",
    Phone = "Необходимо указать телефон"
}
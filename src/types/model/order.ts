import { IOrderForm } from "../view/order";
import { IOrder } from "./larekApi";

export interface IOrderModel {
    readonly order: IOrder;
    readonly formErrors: FormErrors;
    setOrderField(field: keyof IOrderForm, value: string): void;
    validateOrder(fields?: (keyof IOrderForm)[]): boolean;
    createOrder: () => Promise<void>;
}

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;
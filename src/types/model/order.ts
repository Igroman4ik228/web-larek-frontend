import { IOrderForm } from "../view/order";

export interface IOrderModel {
    readonly formErrors: FormErrors;
    setOrderField(field: keyof IOrderForm, value: string): void;
    validateOrder(): boolean;
    isValidOrderPayment(): boolean;
    isValidOrderContact(): boolean;
    createOrder: () => Promise<void>;
}

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;
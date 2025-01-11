export type PaymentMethod = "online" | "cash" | "";

export interface IOrderPaymentData {
    payment: PaymentMethod;
    address: string;
}

export interface IOrderContactData {
    email: string;
    phone: string;
}

export type IOrderForm = IOrderPaymentData & IOrderContactData;
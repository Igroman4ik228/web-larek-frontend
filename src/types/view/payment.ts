export type PaymentMethod = "online" | "cash";

export interface IPaymentData {
    payment: PaymentMethod;
    address: string;
}
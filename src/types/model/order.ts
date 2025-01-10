import { IOrder, IOrderResult } from "./larekApi";

export interface IOrderModel {
    order: IOrder;
    createOrder: () => Promise<IOrderResult>;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;
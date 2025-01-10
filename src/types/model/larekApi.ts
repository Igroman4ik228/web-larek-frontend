export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
}

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export type PaymentMethod = "online" | "cash";

export interface IOrder {
    payment: PaymentMethod;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export interface IOrderResult {
    id: string;
    total: number;
}

export interface ILarekApi {
    getProductList: () => Promise<IProduct[]>;
    getProduct: (id: string) => Promise<IProduct>;
    createOrder: (order: IOrder) => Promise<IOrderResult>;
}

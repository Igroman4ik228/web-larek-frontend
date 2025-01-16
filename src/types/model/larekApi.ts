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

// todo payment: "online" | "cash"
export interface IOrder {
    payment: string;
    address: string;
    email: string;
    phone: string;
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

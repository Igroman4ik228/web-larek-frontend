export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export interface ICart {
    products: IProduct[];
    totalPrice: number;
}

export interface IPayment {
    paymentMethod: string;
    address: string;
    email: string;
    phone: string;
}
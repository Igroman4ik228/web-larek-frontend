import { IProduct } from "./larekApi";

export interface ICatalogModel {
    products: IProduct[];
    getProduct(id: string): IProduct;
}
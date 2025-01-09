import { IProduct } from "./larekApi";

export interface ICatalogModel {
    items: IProduct[];
    setItems(items: IProduct[]): void;
    getProduct(id: string): IProduct;
}
import { IProduct } from "../../types/model/larekApi";


interface ICatalogModel {
    items: IProduct[];
    setItems(items: IProduct[]): void;
    getProduct(id: string): IProduct;
}


export class CatalogModel implements ICatalogModel {
    items: IProduct[] = [];

    setItems(items: IProduct[]) {
        this.items = items;
    }

    getProduct(id: string): IProduct {
        const product = this.items.find(item => item.id === id);
        if (!product) {
            throw new Error(`Продукт с id ${id} не найден`);
        }
        return product;
    }
}
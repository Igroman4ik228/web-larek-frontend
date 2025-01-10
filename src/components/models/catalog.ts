import { ModelStates } from "../../types";
import { IEvents } from "../../types/base/events";
import { ILarekApi, IProduct } from "../../types/model/larekApi";

export interface ICatalogModel {
    products: IProduct[];
    getProduct(id: string): IProduct;
    loadProducts(): Promise<void>;
}

/**
 * Модель для списка товаров
 */
export class CatalogModel implements ICatalogModel {
    protected _products: IProduct[] = [];

    constructor(protected events: IEvents, protected larekApi: ILarekApi) { }

    get products(): IProduct[] {
        return this._products;
    }

    set products(value: IProduct[]) {
        this._products = value;
        this.events.emit(
            ModelStates.catalogChange,
            { items: value }
        );
    }

    getProduct(id: string): IProduct {
        const product = this._products.find(item => item.id === id);
        if (!product)
            throw new Error(`Продукт с id ${id} не найден`);

        return product;
    }

    async loadProducts() {
        this.products = await this.larekApi.getProductList();
    }
}
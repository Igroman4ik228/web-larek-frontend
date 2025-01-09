import { ICatalogModel } from "../../types/model/catalog";
import { IProduct } from "../../types/model/larekApi";
import { Model } from "../base/model";

export class CatalogModel extends Model<ICatalogModel> {
    items: IProduct[] = [];

    setItems(items: IProduct[]) {
        this.items = items;
        this.emitChanges("model:catalog-change", { items });
    }

    getProduct(id: string): IProduct {
        const product = this.items.find(item => item.id === id);
        if (!product) {
            throw new Error(`Продукт с id ${id} не найден`);
        }
        return product;
    }
}
import { IProduct } from "../../types";
import { IEvents } from "../base/events";

interface ICartModel {
    items: Map<string, number>;
    add(id: string): void;
    remove(id: string): void;
}

export class CartModel implements ICartModel {
    items: Map<string, number> = new Map();

    constructor(protected events: IEvents) { }

    add(id: string) {
        if (!this.items.has(id)) this.items.set(id, 0);

        this.items.set(id, this.items.get(id)! + 1);

        this._changed();
    }

    remove(id: string) {
        if (!this.items.has(id)) return;

        if (this.items.get(id)! > 0) {
            this.items.set(id, this.items.get(id)! - 1)

            if (this.items.get(id)! === 0) this.items.delete(id);
        };

        this._changed();
    }

    protected _changed() {
        this.events.emit("cart:change", { items: Array.from(this.items.keys()) });
    }
}


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
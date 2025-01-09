import { IEvents } from "../../types/base/events";
import { ICartModel } from "../../types/model/cart";
import { ICatalogModel } from "../../types/model/catalog";
import { Model } from "../base/model";

export class CartModel extends Model<ICartModel> {
    items: Map<string, number> = new Map();
    totalPrice: number;

    constructor(data: Partial<ICartModel>, events: IEvents, protected catalogModel: ICatalogModel) {
        super(data, events);
        this.totalPrice = 0;
    }

    add(id: string) {
        if (!this.items.has(id)) this.items.set(id, 0);

        this.items.set(id, this.items.get(id)! + 1);


        const product = this.catalogModel.getProduct(id);
        console.log(product);
        this.totalPrice += product.price;
        console.log(this.totalPrice);


        this.emitChanges("model:cart-change", { items: Array.from(this.items.keys()) });
    }

    remove(id: string) {
        if (!this.items.has(id)) return;

        if (this.items.get(id)! > 0) {
            this.items.set(id, this.items.get(id)! - 1)

            if (this.items.get(id)! === 0) this.items.delete(id);
        };

        const product = this.catalogModel.getProduct(id);
        this.totalPrice -= product.price;

        this.emitChanges("model:cart-change", { items: Array.from(this.items.keys()) });
    }
}

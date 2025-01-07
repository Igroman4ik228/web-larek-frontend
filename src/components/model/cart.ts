import { Model } from "../base/model";

interface ICartModel {
    items: Map<string, number>;
    add(id: string): void;
    remove(id: string): void;
}

export class CartModel extends Model<ICartModel> {
    items: Map<string, number> = new Map();

    add(id: string) {
        if (!this.items.has(id)) this.items.set(id, 0);

        this.items.set(id, this.items.get(id)! + 1);

        super.emitChanges("model:cart-change", { items: Array.from(this.items.keys()) });
    }

    remove(id: string) {
        if (!this.items.has(id)) return;

        if (this.items.get(id)! > 0) {
            this.items.set(id, this.items.get(id)! - 1)

            if (this.items.get(id)! === 0) this.items.delete(id);
        };

        super.emitChanges("model:cart-change", { items: Array.from(this.items.keys()) });
    }
}

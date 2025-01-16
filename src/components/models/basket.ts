import { ModelStates } from "../../types";
import { IEvents } from "../../types/base/events";
import { IBasketModel } from "../../types/model/basket";
import { ICatalogModel } from "../../types/model/catalog";

/**
 * Модель для корзины
 */
export class BasketModel implements IBasketModel {
    // Set, так как уникальные элементы в корзине
    protected _productIds: Set<string> = new Set();

    constructor(
        protected readonly events: IEvents,
        protected readonly catalogModel: ICatalogModel
    ) { }

    get productIds() { return Array.from(this._productIds); }

    get totalPrice() {
        const productMap = new Map(
            this.catalogModel.products.map(
                product => [product.id, product.price]
            )
        );

        return Array.from(this._productIds).reduce((total, id) => {
            const price = productMap.get(id);

            if (!price) return total;
            return total + price;
        }, 0); // Начальная сумма равна 0
    }

    get isValid() { return this.totalPrice > 0; }

    add(productId: string) {
        this._productIds.add(productId);
        this.events.emit(ModelStates.basketChange);
    }

    remove(productId: string) {
        if (this._productIds.delete(productId))
            this.events.emit(ModelStates.basketChange);
    }

    has(productId: string) {
        return this._productIds.has(productId);
    }

    getIndex(productId: string) {
        return Array.from(this._productIds).indexOf(productId);
    }

    clear() {
        this._productIds.clear();
        this.events.emit(ModelStates.basketChange);
    }
}
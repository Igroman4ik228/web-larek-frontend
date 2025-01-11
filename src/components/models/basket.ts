import { ModelStates } from "../../types";
import { IEvents } from "../../types/base/events";
import { IBasketModel } from "../../types/model/basket";
import { ICatalogModel } from "../../types/model/catalog";

/**
 * Модель для корзины
 */
export class BasketModel implements IBasketModel {
    protected _productIds: string[] = [];

    constructor(
        protected readonly events: IEvents,
        protected readonly catalogModel: ICatalogModel
    ) { }

    get productIds() { return this._productIds; }
    get totalPrice() {
        const productMap = new Map(
            this.catalogModel.products.map(
                product => [product.id, product.price]
            )
        );

        return this._productIds.reduce((total, id) => {
            const price = productMap.get(id);

            if (!price) return total;
            return total + price;
        }, 0); // Начальная сумма равна 0
    }

    add(productId: string) {
        if (this.has(productId)) return;
        this._productIds.push(productId);

        this.events.emit(ModelStates.basketChange);
    }

    remove(productId: string) {
        if (!this.has(productId)) return;
        const index = this.getIndex(productId);
        this._productIds.splice(index, 1);

        this.events.emit(ModelStates.basketChange);
    }

    has(productId: string) {
        return this._productIds.includes(productId);
    }

    getIndex(productId: string) {
        return this._productIds.indexOf(productId);
    }

    clear() {
        this._productIds = [];

        this.events.emit(ModelStates.basketChange);
    }
}
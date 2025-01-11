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
        let totalPrice = 0
        const products = this.catalogModel.products

        for (const id of this.productIds) {

            const product = products.find(
                product => product.id === id
            )
            if (product && product.price !== null) {
                totalPrice += product.price
            }
        };
        return totalPrice
    }

    add(productId: string) {
        if (this.has(productId))
            return;

        this._productIds.push(productId);

        this.events.emit(ModelStates.basketChange);
    }

    remove(productId: string) {
        if (!this.has(productId))
            return;

        const index = this.getIndex(productId);
        const deleteCount = 1
        this._productIds.splice(index, deleteCount);

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
import { ModelStates } from "../../types";
import { IEvents } from "../../types/base/events";
import { IBasketModel } from "../../types/model/basket";
import { ICatalogModel } from "../../types/model/catalog";

/**
 * Модель для корзины
 */
export class BasketModel implements IBasketModel {
    protected _items: string[] = [];
    protected _totalPrice = 0;

    constructor(protected events: IEvents, protected catalogModel: ICatalogModel) { }

    get items() { return this._items }
    get totalPrice() { return this._totalPrice }

    add(id: string) {
        if (this._items.includes(id))
            return;

        this._items.push(id);

        const product = this.catalogModel.getProduct(id);
        if (product.price !== null) {
            this._totalPrice += product.price;
        };

        this.events.emit(
            ModelStates.basketChange, { ids: this._items }
        );
    }

    remove(id: string) {
        if (!this.has(id))
            return;

        const index = this._items.indexOf(id);
        this._items.splice(index, 1);

        const product = this.catalogModel.getProduct(id);
        if (product.price !== null) {
            this._totalPrice -= product.price;
        };

        this.events.emit(
            ModelStates.basketChange, { ids: this._items }
        );
    }

    has(id: string) {
        return this._items.includes(id);
    }

    getIndex(id: string) {
        return this._items.indexOf(id);
    }

    validateTotalPrice() {
        if (this._totalPrice <= 0) {
            return false
        }

        return true
    }

    clear() {
        this._items = [];
        this._totalPrice = 0;

        this.events.emit(
            ModelStates.basketChange,
            { ids: this._items }
        );
    }
}
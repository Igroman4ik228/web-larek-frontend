import { ModelStates } from "../../types";
import { IEvents } from "../../types/base/events";
import { ICatalogModel } from "./catalog";

export type BasketItem = { id: string, count: number }
export type BasketItems = Map<BasketItem["id"], BasketItem["count"]>

export interface IBasketModel {
    readonly items: BasketItems;
    readonly totalPrice: number;
    add(id: string): void;
    remove(id: string): void;
    clear(): void;
}

/**
 * Модель для корзины
 */
export class BasketModel implements IBasketModel {
    protected _items: BasketItems = new Map();
    protected _totalPrice = 0;

    constructor(protected events: IEvents, protected catalogModel: ICatalogModel) { }

    get items() { return this._items }
    get totalPrice() { return this._totalPrice }

    add(id: string) {
        if (!this._items.has(id)) this._items.set(id, 0);
        this._items.set(id, this._items.get(id)! + 1);

        const product = this.catalogModel.getProduct(id);
        if (product.price !== null) {
            this._totalPrice += product.price;
        };

        this.events.emit(
            ModelStates.basketChange,
            {
                items: Array.from(this._items.keys()),
                totalPrice: this._totalPrice
            }
        );
    }

    remove(id: string) {
        if (!this._items.has(id)) return;

        if (this._items.get(id)! > 0) {
            this._items.set(id, this._items.get(id)! - 1)

            if (this._items.get(id)! === 0)
                this._items.delete(id);
        };

        const product = this.catalogModel.getProduct(id);
        if (product.price !== null) {
            this._totalPrice -= product.price;
        };

        this.events.emit(
            ModelStates.basketChange,
            {
                items: Array.from(this._items.keys()),
                totalPrice: this._totalPrice
            }
        );
    }

    clear(): void {
        this._items.clear();
        this._totalPrice = 0;

        this.events.emit(
            ModelStates.basketChange,
            {
                items: Array.from(this._items.keys()),
                totalPrice: this._totalPrice
            }
        );
    }
}
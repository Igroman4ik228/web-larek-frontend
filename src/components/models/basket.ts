import { ModelStates } from "../../types";
import { IEvents } from "../../types/base/events";
import { IBasketModel, IBasketProduct, IBasketProductData } from "../../types/model/basket";

/**
 * Модель для корзины
 */
export class BasketModel implements IBasketModel {
    protected _products: Map<string, IBasketProductData> = new Map();

    constructor(protected readonly events: IEvents) { }

    get products(): IBasketProduct[] {
        return Array.from(this._products.entries())
            .map(([id, data]) => ({
                id,
                ...data
            }));
    }

    get totalPrice(): number {
        return Array.from(this._products.values())
            .reduce((sum, product) => sum + (product.price || 0), 0);
    }

    get isValid(): boolean {
        return this.totalPrice > 0;
    }

    add(product: IBasketProduct) {
        const { id, ...data } = product;
        this._products.set(id, data);
        this.events.emit(ModelStates.basketChange);
    }

    remove(productId: string) {
        if (this._products.delete(productId))
            this.events.emit(ModelStates.basketChange);
    }

    has(productId: string): boolean {
        return this._products.has(productId);
    }

    getIndex(productId: string): number {
        return Array.from(this._products.keys()).indexOf(productId);
    }

    clear() {
        this._products.clear();
        this.events.emit(ModelStates.basketChange);
    }
}
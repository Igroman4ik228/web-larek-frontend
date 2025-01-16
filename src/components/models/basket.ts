import { ModelStates } from "../../types";
import { IEvents } from "../../types/base/events";
import { IBasketModel } from "../../types/model/basket";
import { ICatalogModel } from "../../types/model/catalog";
import { ILocalStorageModel, PersistedState } from "../../types/model/localStorage";

/**
 * Модель для корзины
 */
export class BasketModel implements IBasketModel {
    // Set, так как уникальные элементы в корзине
    protected _productIds: Set<string> = new Set();

    constructor(
        protected readonly events: IEvents,
        protected readonly catalogModel: ICatalogModel,
        protected readonly localStorage: ILocalStorageModel
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

    persistState() {
        const state: PersistedState = {
            productIds: Array.from(this._productIds)
        }
        this.localStorage.set(JSON.stringify(state));
    }

    restoreState() {
        const state = this.localStorage.get();
        if (!state) return;
        const data = JSON.parse(state) as PersistedState;

        if (!this.validateState(data)) return;

        this._productIds = new Set(data.productIds);
        this.events.emit(ModelStates.basketChange);
    }

    validateState(value: PersistedState): boolean {
        if (!Array.isArray(value.productIds))
            return false;
        if (value.productIds.length === 0)
            return false;

        // Проверка на существование товаров и валидность цен
        try {
            value.productIds.every(id => {
                const product = this.catalogModel.getProduct(id)
                if (product.price === null)
                    throw new Error(`Product ${id} with null price cannot be in basket`);
                return true
            });
        }
        catch {
            this.localStorage.set(JSON.stringify([]));
            return false;
        }

        return true;
    }
}
import { ModelStates } from "../../types";
import { IEvents } from "../../types/base/events";
import { IBasketModel } from "../../types/model/basket";
import { ICatalogModel } from "../../types/model/catalog";
import { ILarekApi, IOrder, IOrderResult } from "../../types/model/larekApi";
import { FormErrors, IOrderModel } from "../../types/model/order";

export class OrderModel implements IOrderModel {
    protected _order: IOrder | null = null;
    protected formErrors: FormErrors = {};

    constructor(
        protected events: IEvents,
        protected larekApi: ILarekApi,
        protected basketModel: IBasketModel,
        protected catalogModel: ICatalogModel
    ) { }

    set order(value: IOrder) {
        this._order = value;
    }

    get order(): IOrder {
        if (!this._order)
            throw new Error("Заказ не создан");

        return this._order;
    }

    async createOrder(): Promise<IOrderResult> {
        const orderResult = await this.larekApi
            .createOrder(this.order)
            .catch(() => { throw new Error("Ошибка при создании заказа") });

        this.basketModel.clear();

        this._order = null;

        this.events.emit(ModelStates.orderCreate, { item: orderResult });

        return orderResult;
    }
    protected validateOrder(): boolean {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = "Необходимо указать email";
        }
        if (!this.order.phone) {
            errors.phone = "Необходимо указать телефон";
        }
        if (!this.order.address) {
            errors.address = "Необходимо указать телефон";
        }

        this.formErrors = errors;
        this.events.emit(ModelStates.formErrorChange, this.formErrors);
        return Object.keys(errors).length === 0;
    }
}
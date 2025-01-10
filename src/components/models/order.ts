import { ModelStates } from "../../types";
import { IEvents } from "../../types/base/events";
import { ILarekApi, IOrder, IOrderResult } from "../../types/model/larekApi";
import { IBasketModel } from "./basket";

export interface IOrderModel {
    order: IOrder;
    createOrder: () => Promise<IOrderResult>;
}

export class OrderModel implements IOrderModel {
    protected _order: IOrder | null = null;

    constructor(protected events: IEvents, protected larekApi: ILarekApi, protected basketModel: IBasketModel) { }

    set order(value: IOrder) {
        this._order = value;
    }

    get order(): IOrder {
        if (!this._order)
            throw new Error("Заказ не создан");

        return this._order;
    }

    async createOrder() {
        const orderResult = await this.larekApi
            .createOrder(this.order)
            .catch(() => { throw new Error("Ошибка при создании заказа") });

        this.basketModel.clear();

        this._order = null;

        this.events.emit(ModelStates.createOrder, { item: orderResult });

        return orderResult;
    }
}
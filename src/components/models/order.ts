import { ModelStates } from "../../types";
import { IEvents } from "../../types/base/events";
import { IBasketModel } from "../../types/model/basket";
import { ILarekApi, IOrder } from "../../types/model/larekApi";
import { FormErrors, IOrderModel } from "../../types/model/order";
import { IOrderForm } from "../../types/view/order";

export class OrderModel implements IOrderModel {
    protected _order: IOrder = {
        payment: "",
        address: "",
        email: "",
        phone: "",
        total: 0,
        items: []
    };
    protected _formErrors: FormErrors = {
        payment: "",
        address: "",
        email: "",
        phone: ""
    };

    constructor(
        protected events: IEvents,
        protected larekApi: ILarekApi,
        protected basketModel: IBasketModel
    ) { }

    get formErrors(): FormErrors {
        return this._formErrors;
    }

    setOrderField(field: keyof IOrderForm, value: string) {
        if (field === "payment") {
            if (value === "")
                throw new Error(`Invalid payment method: ${value}`);

            this._order[field] = value as "cash" | "online";
        }
        else
            this._order[field] = value;

        this.validateOrder();
    }

    validateOrder(): boolean {
        const errors: typeof this._formErrors = {};
        if (!this._order.payment) {
            errors.payment = "Необходимо выбрать способ оплаты";
        }
        if (!this._order.address) {
            errors.address = "Необходимо указать адрес";
        }
        if (!this._order.email) {
            errors.email = "Необходимо указать email";
        }
        if (!this._order.phone) {
            errors.phone = "Необходимо указать телефон";
        }

        this._formErrors = errors;
        this.events.emit(ModelStates.formPaymentErrorChange, this._formErrors);
        this.events.emit(ModelStates.formContactErrorChange, this._formErrors);

        return Object.keys(errors).length === 0;
    }

    isValidOrderPayment(): boolean {
        if (this._order.payment === "" || this._order.address === "") {
            return false
        }
        if (this._order.payment === undefined || this._order.address === undefined) {
            return false
        }
        return true
    }

    isValidOrderContact(): boolean {
        if (this._order.email === "" || this._order.phone === "") {
            return false
        }
        if (this._order.email === undefined || this._order.phone === undefined) {
            return false
        }
        return true
    }

    async createOrder(): Promise<void> {
        this._order.items = this.basketModel.productIds
        this._order.total = this.basketModel.totalPrice

        this.larekApi.createOrder(this._order)
            .then(orderResult => {
                this.basketModel.clear();

                this._order = {
                    payment: "",
                    address: "",
                    email: "",
                    phone: "",
                    items: [],
                    total: 0
                };

                this.events.emit(ModelStates.orderCreate, orderResult);
            })
            .catch(err => {
                throw new Error(err);
            })
    }
}
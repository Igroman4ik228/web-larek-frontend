import { ModelStates } from "../../types";
import { IEvents } from "../../types/base/events";
import { IBasketModel } from "../../types/model/basket";
import { ILarekApi, IOrder } from "../../types/model/larekApi";
import { FormErrors, IOrderModel } from "../../types/model/order";
import { ErrorMessages, IOrderForm } from "../../types/view/order";

export class OrderModel implements IOrderModel {
    protected _order: IOrder = {
        payment: "",
        address: "",
        email: "",
        phone: "",
        total: 0,
        items: []
    };

    protected _formErrors: FormErrors = {};

    protected readonly VALIDATIONS: { [key in keyof IOrderForm]: string } = {
        payment: ErrorMessages.Payment,
        address: ErrorMessages.Address,
        email: ErrorMessages.Email,
        phone: ErrorMessages.Phone
    };

    constructor(
        protected readonly events: IEvents,
        protected readonly larekApi: ILarekApi,
        protected readonly basketModel: IBasketModel
    ) { }

    get order(): IOrder {
        return this._order;
    }

    get formErrors(): FormErrors {
        return this._formErrors;
    }

    setOrderField(field: keyof IOrderForm, value: string) {
        this._order[field] = value;

        if (field === "payment")
            this.events.emit(ModelStates.paymentMethodChange);

        this.validateOrder();
    }

    validateOrder(
        fields: (keyof IOrderForm)[] =
            Object.keys(this.VALIDATIONS) as (keyof IOrderForm)[]
    ): boolean {
        const errors: FormErrors = {};

        fields.forEach(field => {
            if (!this._order[field]) {
                errors[field] = this.VALIDATIONS[field];
            }
            // Сюда можно дописать ещё какие-то проверки и разные сообщения об ошибках
        })

        this._formErrors = errors;
        this.events.emit(ModelStates.formErrorChange);
        return Object.keys(errors).length === 0;
    }

    async createOrder(): Promise<void> {
        if (!this.validateOrder())
            throw new Error("Данные заказа не корректны");

        this.prepareOrder();

        await this.larekApi.createOrder(this._order)
            .then(result => {
                // Очистка корзины
                this.basketModel.clear();

                this.events.emit(ModelStates.successOpen, { total: result.total });
            })
            .catch(err => console.error(err));
    }

    protected prepareOrder(): void {
        this._order.items = this.basketModel.productIds;
        this._order.total = this.basketModel.totalPrice;
    }
}
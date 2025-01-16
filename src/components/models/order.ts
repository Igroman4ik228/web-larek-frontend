import { ModelStates } from "../../types";
import { IEvents } from "../../types/base/events";
import { ErrorMessages, FormErrors, IOrderData, IOrderModel } from "../../types/model/order";
import { OrderForm } from "../../types/view/order";

/**
 * Модель заказа
 */
export class OrderModel implements IOrderModel {
    protected _order: IOrderData = {
        payment: "",
        address: "",
        email: "",
        phone: ""
    };

    protected _formErrors: FormErrors = {};

    protected readonly VALIDATIONS: { [key in keyof OrderForm]: string } = {
        payment: ErrorMessages.Payment,
        address: ErrorMessages.Address,
        email: ErrorMessages.Email,
        phone: ErrorMessages.Phone
    };

    constructor(protected readonly events: IEvents) { }

    get order(): IOrderData {
        return this._order;
    }

    get formErrors(): FormErrors {
        return this._formErrors;
    }

    setOrderField(field: keyof OrderForm, value: string) {
        this._order[field] = value;

        if (field === "payment")
            this.events.emit(ModelStates.paymentMethodChange);

        this.validateOrder();
    }

    validateOrder(
        fields: (keyof OrderForm)[] =
            Object.keys(this.VALIDATIONS) as (keyof OrderForm)[]
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
}
import { ModelStates, UserForm } from "../../types";
import { IEvents } from "../../types/base/events";
import { ErrorMessages, FormErrors, IUserData, IUserModel } from "../../types/model/user";

/**
 * Модель для данных пользователя
 */
export class UserDataModel implements IUserModel {
    protected _order: IUserData = {
        payment: "",
        address: "",
        email: "",
        phone: ""
    };

    protected _formErrors: FormErrors = {};

    protected readonly VALIDATIONS: { [key in keyof UserForm]: string } = {
        payment: ErrorMessages.Payment,
        address: ErrorMessages.Address,
        email: ErrorMessages.Email,
        phone: ErrorMessages.Phone
    };

    constructor(protected readonly events: IEvents) { }

    get order(): IUserData {
        return this._order;
    }

    get formErrors(): FormErrors {
        return this._formErrors;
    }

    setUserField(field: keyof UserForm, value: string) {
        this._order[field] = value;

        if (field === "payment")
            this.events.emit(ModelStates.paymentMethodChange);

        this.validateUserFields();
    }

    validateUserFields(
        fields: (keyof UserForm)[] =
            Object.keys(this.VALIDATIONS) as (keyof UserForm)[]
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
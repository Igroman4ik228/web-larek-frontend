import { ModelStates, UserDataForm } from "../../types";
import { IEvents } from "../../types/base/events";
import { ErrorMessages, FormErrors, IUserData, IUserModel } from "../../types/model/user";

/**
 * Модель для данных пользователя
 */
export class UserDataModel implements IUserModel {
    protected _userData: IUserData = {
        payment: "",
        address: "",
        email: "",
        phone: ""
    };

    protected readonly VALIDATIONS: { [key in keyof UserDataForm]: string } = {
        payment: ErrorMessages.Payment,
        address: ErrorMessages.Address,
        email: ErrorMessages.Email,
        phone: ErrorMessages.Phone
    };

    constructor(protected readonly events: IEvents) { }

    get userData(): IUserData {
        return this._userData;
    }

    set(field: keyof UserDataForm, value: string) {
        this._userData[field] = value;

        if (field === "payment")
            this.events.emit(ModelStates.paymentMethodChange);
    }

    validate(
        fields: (keyof UserDataForm)[] =
            Object.keys(this.VALIDATIONS) as (keyof UserDataForm)[]
    ): FormErrors {
        const errors: FormErrors = {};

        fields.forEach(field => {
            if (!this._userData[field]) {
                errors[field] = this.VALIDATIONS[field];
            }
            // Сюда можно дописать ещё какие-то проверки и разные сообщения об ошибках
        })

        return errors
    }
}
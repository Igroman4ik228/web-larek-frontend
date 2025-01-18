import { ModelStates, UserDataForm } from "../../types";
import { IEvents } from "../../types/base/events";
import { ErrorMessages, FormErrors, IUserData, IUserModel } from "../../types/model/userData";

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

    protected readonly VALIDATIONS: Record<keyof UserDataForm, (value: string) => string | null> = {
        payment: (value) => !value ? ErrorMessages.Payment : null,
        address: (value) => !value ? ErrorMessages.Address : null,
        email: (value) => !value ? ErrorMessages.Email : null,
        phone: (value) => !value ? ErrorMessages.Phone : null,
    };

    constructor(protected readonly events: IEvents) { }

    get userData(): IUserData {
        return this._userData;
    }

    set(field: keyof UserDataForm, value: string) {
        this._userData[field] = value;
        this.events.emit(ModelStates.userDataChange);
    }

    validate(
        fields: (keyof UserDataForm)[] =
            Object.keys(this.VALIDATIONS) as (keyof UserDataForm)[]
    ): FormErrors {
        return fields.reduce((errors: FormErrors, field) => {
            const error = this.VALIDATIONS[field](this._userData[field]);
            if (error)
                errors[field] = error;
            return errors;
        }, {}); // Значение по умолчанию {}
    }
}
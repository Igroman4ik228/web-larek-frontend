import { UserForm } from "..";

export interface IUserData {
    payment: string;
    address: string;
    email: string;
    phone: string;
}

export type FormErrors = Partial<Record<keyof UserForm, string>>;

export interface IUserModel {
    readonly order: IUserData;
    readonly formErrors: FormErrors;
    setUserField(field: keyof UserForm, value: string): void;
    validateUserFields(fields?: (keyof UserForm)[]): boolean;
}

export enum ErrorMessages {
    Payment = "Необходимо выбрать способ оплаты",
    Address = "Необходимо указать адрес",
    Email = "Необходимо указать email",
    Phone = "Необходимо указать телефон"
}
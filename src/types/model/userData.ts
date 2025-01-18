import { UserDataForm } from "..";

export interface IUserData {
    payment: string;
    address: string;
    email: string;
    phone: string;
}

export type FormErrors = Partial<Record<keyof UserDataForm, string>>;

export interface IUserModel {
    readonly userData: IUserData;
    set(field: keyof UserDataForm, value: string): void;
    validate(fields?: (keyof UserDataForm)[]): FormErrors;
}

export enum ErrorMessages {
    Payment = "Необходимо выбрать способ оплаты",
    Address = "Необходимо указать адрес",
    Email = "Необходимо указать email",
    Phone = "Необходимо указать телефон"
}
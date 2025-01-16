import { ILocalStorageModel } from "../../types/model/localStorage";
import { STORAGE_KEY } from "../../utils/constants";

/**
 * Модель для работы с localStorage. Захотелось попробовать поработать с ним
 */
export class LocalStorageModel implements ILocalStorageModel {
    set(value: string, key: string = STORAGE_KEY): void {
        if (!localStorage) return;
        localStorage.setItem(key, value);
    }

    get(key: string = STORAGE_KEY): string | null {
        if (!localStorage) return null;
        return localStorage.getItem(key);
    }
}
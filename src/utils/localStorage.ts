import { STORAGE_KEY } from "./constants";

export function getState(key: string = STORAGE_KEY): string | null {
    if (!localStorage) return null;
    return localStorage.getItem(key);
}

export function setState(value: string, key: string = STORAGE_KEY): void {
    if (!localStorage) return;
    localStorage.setItem(key, value);
}
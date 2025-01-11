import { CURRENCY } from "./constants";

export function isSelector<T>(x: string | T): x is string {
    return (typeof x === "string") && x.length > 1;
}

export function isEmpty(value: any): boolean {
    return value === null || value === undefined;
}

export function isBoolean(v: unknown): v is boolean {
    return typeof v === "boolean";
}

export function pascalToKebab(value: string): string {
    return value.replace(/([a-z0–9])([A-Z])/g, "$1-$2").toLowerCase();
}

/**
 * Проверка на простой объект
 */
export function isPlainObject(obj: unknown): obj is object {
    const prototype = Object.getPrototypeOf(obj);
    return prototype === Object.getPrototypeOf({}) ||
        prototype === null;
}

/**
 * Возвращает список свойств объекта, кроме constructor.
 * @param obj объект, для которого нужно получить список свойств
 * @param filter - функция, которая будет вызвана для каждого свойства,
 *                 она должна вернуть true, если свойство нужно включить
 *                 в результат, и false, если нет.
 * @returns список имен свойств объекта, кроме constructor
 */
export function getObjectProperties(
    obj: object,
    filter?: (name: string, prop: PropertyDescriptor) => boolean
): string[] {
    return Object.entries(
        Object.getOwnPropertyDescriptors(
            Object.getPrototypeOf(obj)
        )
    )
        .filter(([name, prop]: [string, PropertyDescriptor]) =>
            filter ? filter(name, prop) : (name !== "constructor"))

        .map(([name, prop]) => name);
}

export function formatCurrency(value: number | null): string {
    if (value === null) return "Бесценно";
    return `${value} ${CURRENCY}`
}
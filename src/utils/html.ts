import { isPlainObject, isSelector } from ".";
import { ElementChild, ElementProps, SelectorCollection, SelectorElement } from "../types/html";

/**
 * Убеждается что элемент существует
 * @param selectorElement может быть селектором, элементом или коллекцией элементов
 * @param context
 */
export function ensureElement<T extends HTMLElement>(
    selectorElement: SelectorElement<T>,
    context?: HTMLElement
): T {
    if (isSelector(selectorElement)) {
        const elements = ensureAllElements<T>(selectorElement, context);
        if (elements.length > 1) {
            console.warn(`selector ${selectorElement} return more then one element`);
        }
        if (elements.length === 0) {
            throw new Error(`selector ${selectorElement} return nothing`);
        }
        return elements.pop() as T;
    }
    if (selectorElement instanceof HTMLElement) {
        return selectorElement as T;
    }
    throw new Error("Unknown selector element");
}

/**
 * Убеждается что все элементы существуют
 * @param selectorElement
 * @param context
 */
export function ensureAllElements<T extends HTMLElement>(
    selectorElement: SelectorCollection<T>,
    context: HTMLElement = document as unknown as HTMLElement
): T[] {
    if (isSelector(selectorElement)) {
        return Array.from(context.querySelectorAll(selectorElement)) as T[];
    }
    if (selectorElement instanceof NodeList) {
        return Array.from(selectorElement) as T[];
    }
    if (Array.isArray(selectorElement)) {
        return selectorElement;
    }
    throw new Error(`Unknown selector element`);
}

/**
 * Создает элемент и устанавливает ему свойства и дочерние элементы
 */
export function createElement<T extends HTMLElement>(
    tagName: keyof HTMLElementTagNameMap,
    props?: ElementProps<T>,
    children?: ElementChild
): T {
    const element = document.createElement(tagName) as T;
    if (props) {
        setElementProps(element, props);
    }
    if (children) {
        setElementChildren(element, children);
    }
    return element;
}

/**
 * Устанавливает дочерние элементы
 */
export function setElementChildren(root: HTMLElement, children: ElementChild) {
    root.replaceChildren(...(Array.isArray(children) ? children : [children]));
}

/**
 * Устанавливает свойства элемента
 */
export function setElementProps<T extends HTMLElement>(
    element: HTMLElement,
    props: ElementProps<T>
) {
    for (const key in props) {
        const value = props[key];
        if (isPlainObject(value) && key === "dataset") {
            setElementData(element, value);
        } else {
            // @ts-expect-error fix indexing later
            element[key] = isBoolean(value) ? value : String(value);
        }
    }
}

/**
 * Клонирует элемент из тега template
 */
export function cloneTemplate<T extends HTMLElement>(query: string | HTMLTemplateElement): T {
    const template = ensureElement(query) as HTMLTemplateElement;
    const first = template.content.firstElementChild
    if (!first) {
        throw new Error("Template is empty");
    }

    return first.cloneNode(true) as T;
}

/**
 * Устанавливает dataset атрибуты элемента
 */
export function setElementData<T extends Record<string, unknown> | object>(
    el: HTMLElement,
    data: T
) {
    for (const key in data) {
        el.dataset[key] = String(data[key]);
    }
}

/**
 * Получает типизированные данные из dataset атрибутов элемента
 */
export function getElementData<T extends Record<string, unknown>>(
    el: HTMLElement,
    scheme: Record<string, Function>
): T {
    const data: Partial<T> = {};
    for (const key in el.dataset) {
        data[key as keyof T] = scheme[key](el.dataset[key]);
    }
    return data as T;
}

/**
 * Для использования элемента или массива элементов в element.replaceChildren
 */
export function isChildElement(x: unknown): x is ElementChild {
    return x instanceof HTMLElement || Array.isArray(x);
}

export function bem(
    block: string,
    element?: string,
    modifier?: string
): { name: string, class: string } {
    let name = block;
    if (element) name += `__${element}`;
    if (modifier) name += `_${modifier}`;
    return {
        name,
        class: `.${name}`
    };
}

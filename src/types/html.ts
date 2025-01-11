export type SelectorElement<T> = T | string;

export type SelectorCollection<T> = string | NodeListOf<Element> | T[];

export type ElementChild = HTMLElement | HTMLElement[];

export type ElementProps<T extends HTMLElement> = Partial<
    Record<keyof T, string | boolean | object>
>;

import { IEvents } from "./events";

export interface IViewConstructor {
    new(container: HTMLElement, events?: IEvents): IView;
}

export interface IView {
    render(data?: object): HTMLElement;
}
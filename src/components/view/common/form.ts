import { IEvents } from "../../../types/base/events";
import { IFormState } from "../../../types/view/common/form";
import { ensureElement } from "../../../utils/html";
import { Component } from "../../base/component";

export class FormView<T> extends Component<IFormState> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected readonly container: HTMLFormElement, protected readonly events: IEvents) {
        super(container);

        this._submit = ensureElement<HTMLButtonElement>("button[type=submit]", this.container);
        this._errors = ensureElement<HTMLElement>(".form__errors", this.container);

        this.container.addEventListener("input", (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        this.container.addEventListener("submit", (e: Event) => {
            e.preventDefault();
            this.events.emit(`view:${this.container.name}-submit`);
        });
    }

    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`view:${this.container.name}.${String(field)}-change`, {
            field,
            value
        });
    }

    set valid(value: boolean) {
        this.setDisabled(this._submit, !value);
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    render(state: Partial<T> & IFormState) {
        const { valid, errors, ...inputs } = state;
        super.render({ valid, errors });
        Object.assign(this, inputs);
        return this.container;
    }
}
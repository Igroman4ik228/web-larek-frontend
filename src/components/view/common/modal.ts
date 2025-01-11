import { ModalStates } from "../../../types";
import { IEvents } from "../../../types/base/events";
import { IModalData } from "../../../types/view/common/modal";
import { ensureElement, setElementChildren } from "../../../utils/html";
import { Component } from "../../base/component";

export class ModalView extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, protected readonly events: IEvents) {
        super(container);

        this._closeButton = ensureElement<HTMLButtonElement>(".modal__close", container);
        this._content = ensureElement<HTMLElement>(".modal__content", container);

        this._closeButton.addEventListener("click", this.close.bind(this));
        this.container.addEventListener("click", this.close.bind(this));
        this._content.addEventListener("click", (event) => event.stopPropagation());
    }

    set content(value: HTMLElement | null) {
        if (value === null)
            setElementChildren(this._content, []);
        else
            setElementChildren(this._content, value);
    }

    open() {
        this.container.classList.add("modal_active");
        this.events.emit(ModalStates.open);
    }

    close() {
        this.container.classList.remove("modal_active");
        this.content = null;
        this.events.emit(ModalStates.close);
    }

    render(data: IModalData): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}
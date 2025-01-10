import { ISuccess, ISuccessActions } from "../../../types/view/common/success";
import { ensureElement } from "../../../utils/html";
import { Component } from "../../base/component";

export class Success extends Component<ISuccess> {
    protected _close: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        this._close = ensureElement<HTMLElement>(".order-success__close", container);

        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }
}
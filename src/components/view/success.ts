import { IOnClickEvent } from '../../types';
import { ISuccessData } from '../../types/view/success';
import { formatCurrency } from '../../utils';
import { ensureElement } from '../../utils/html';
import { Component } from '../base/component';

export class SuccessView extends Component<ISuccessData> {
	protected _close: HTMLElement;
	protected _totalPrice: HTMLElement;

	constructor(container: HTMLElement, actions?: IOnClickEvent) {
		super(container);

		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			container
		);
		this._totalPrice = ensureElement<HTMLElement>(
			'.order-success__description',
			container
		);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	set totalPrice(value: number) {
		this.setText(this._totalPrice, `Списано ${formatCurrency(value)}`);
	}
}

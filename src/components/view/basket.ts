import { IOnClickEvent } from '../../types';
import { IBasketData } from '../../types/view/basket';
import { formatCurrency } from '../../utils';
import { ensureElement, setElementChildren } from '../../utils/html';
import { Component } from '../base/component';

export class BasketView extends Component<IBasketData> {
	protected _containerForItems: HTMLElement;
	protected _totalPrice: HTMLElement;
	protected _submit: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: IOnClickEvent) {
		super(container);

		this._containerForItems = ensureElement<HTMLElement>(
			'.basket__list',
			container
		);
		this._totalPrice = ensureElement<HTMLElement>('.basket__price', container);
		this._submit = ensureElement<HTMLButtonElement>('.button', container);

		if (actions?.onClick)
			this._submit.addEventListener('click', actions.onClick);
	}

	set items(value: HTMLElement[]) {
		setElementChildren(this._containerForItems, value);
	}

	set totalPrice(value: number) {
		this.setText(this._totalPrice, formatCurrency(value));
	}

	set valid(value: boolean) {
		this.setDisabled(this._submit, !value);
	}
}

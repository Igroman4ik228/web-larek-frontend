import { IBaseCardData } from '../../../types/view/cards/base';
import { formatCurrency } from '../../../utils';
import { ensureElement } from '../../../utils/html';
import { Component } from '../../base/component';

export class BaseCardView<T extends IBaseCardData> extends Component<T> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;

	constructor(container: HTMLElement) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number | null) {
		this.setText(this._price, formatCurrency(value));
	}
}

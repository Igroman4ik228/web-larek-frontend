import { BasketProductRemoveEvent, ViewStates } from '../../../types';
import { IEvents } from '../../../types/base/events';
import { ICardBasketData } from '../../../types/view/cards/basket';
import { ensureElement } from '../../../utils/html';
import { BaseCardView } from './base';

export class CardBasketView extends BaseCardView<ICardBasketData> {
	protected _index: HTMLElement;
	protected _removeButton: HTMLButtonElement;

	protected _id: string | undefined;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);

		this._index = ensureElement<HTMLElement>('.basket__item-index', container);
		this._removeButton = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			container
		);

		this._removeButton.addEventListener('click', () => {
			if (!this._id) return;
			events.emit<BasketProductRemoveEvent>(ViewStates.basketProductRemove, {
				productId: this._id,
			});
		});
	}

	set index(value: number) {
		this.setText(this._index, String(value + 1));
	}

	set id(value: string) {
		this._id = value;
	}
}

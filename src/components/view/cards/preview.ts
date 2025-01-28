import { IOnClickEvent } from '../../../types';
import { ICategory } from '../../../types/view/cards/card';
import { ICardPreviewData } from '../../../types/view/cards/preview';
import { formatCurrency } from '../../../utils';
import { ensureElement } from '../../../utils/html';
import { BaseCardView } from './base';

export class CardPreviewView extends BaseCardView<ICardPreviewData> {
	protected _category: HTMLElement;
	protected _image: HTMLImageElement;
	protected _description: HTMLElement;
	protected _buttonBuy: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: IOnClickEvent) {
		super(container);

		this._category = ensureElement<HTMLElement>('.card__category', container);
		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._description = ensureElement<HTMLElement>('.card__text', container);
		this._buttonBuy = ensureElement<HTMLButtonElement>(
			'.card__button',
			container
		);

		if (actions?.onClick)
			this._buttonBuy.addEventListener('click', actions.onClick);
	}

	set category(item: ICategory) {
		this.setText(this._category, item.name);

		const classList = this._category.classList;
		classList.forEach((cls) => {
			if (cls.startsWith('card__category_')) classList.remove(cls);
		});

		classList.add(`card__category_${item.colorClass}`);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set hasInBasket(value: boolean) {
		this.setText(this._buttonBuy, value ? 'Убрать из корзины' : 'В корзину');
	}

	set price(value: number | null) {
		this.setDisabled(this._buttonBuy, value === null);
		this.setText(this._price, formatCurrency(value));
	}
}

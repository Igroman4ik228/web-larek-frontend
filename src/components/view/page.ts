import { ViewStates } from '../../types';
import { IEvents } from '../../types/base/events';
import { IPageData } from '../../types/view/page';
import { ensureElement, setElementChildren } from '../../utils/html';
import { Component } from '../base/component';

export class PageView extends Component<IPageData> {
	protected _catalog: HTMLElement;
	protected _counter: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);

		this._catalog = ensureElement<HTMLElement>('.gallery');
		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._basket = ensureElement<HTMLElement>('.header__basket');

		this._basket.addEventListener('click', () => {
			events.emit(ViewStates.basketOpen);
		});
	}

	set catalog(items: HTMLElement[]) {
		setElementChildren(this._catalog, items);
	}

	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	set locked(value: boolean) {
		this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
	}
}

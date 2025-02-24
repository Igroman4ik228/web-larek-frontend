import { ViewStates } from '../../types';
import { IEvents } from '../../types/base/events';
import { IPaymentData, PaymentMethod } from '../../types/view/payment';
import { ensureElement } from '../../utils/html';
import { FormView } from './common/form';

export class PaymentView extends FormView<IPaymentData> {
	protected _online: HTMLButtonElement;
	protected _cash: HTMLButtonElement;
	protected _address: HTMLInputElement;

	constructor(protected readonly container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._online = ensureElement<HTMLButtonElement>(
			'button[name=card]',
			this.container
		);
		this._cash = ensureElement<HTMLButtonElement>(
			'button[name=cash]',
			this.container
		);
		this._address = ensureElement<HTMLInputElement>(
			'input[name=address]',
			this.container
		);

		this._online.addEventListener('click', () =>
			events.emit(ViewStates.orderPaymentChange, {
				field: 'payment',
				value: 'online',
			})
		);
		this._cash.addEventListener('click', () =>
			events.emit(ViewStates.orderPaymentChange, {
				field: 'payment',
				value: 'cash',
			})
		);
	}

	set payment(value: PaymentMethod) {
		switch (value) {
			case 'cash':
				this._cash.classList.add('button_alt-active');
				this._online.classList.remove('button_alt-active');
				break;
			case 'online':
				this._online.classList.add('button_alt-active');
				this._cash.classList.remove('button_alt-active');
				break;
		}
	}

	set address(value: string) {
		this._address.value = value;
	}
}

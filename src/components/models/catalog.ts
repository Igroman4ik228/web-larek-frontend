import { ModelStates } from '../../types';
import { IEvents } from '../../types/base/events';
import { ICatalogModel } from '../../types/model/catalog';
import { IProduct } from '../../types/model/larekApi';

/**
 * Модель для списка товаров
 */
export class CatalogModel implements ICatalogModel {
	protected _products: IProduct[] = [];

	constructor(protected readonly events: IEvents) {}

	set products(value: IProduct[]) {
		this._products = value;
		this.events.emit(ModelStates.catalogChange);
	}

	get products(): IProduct[] {
		return this._products;
	}

	getProduct(id: string): IProduct {
		const product = this._products.find((item) => item.id === id);
		if (!product) throw new Error(`Product with id ${id} not found`);

		return product;
	}
}

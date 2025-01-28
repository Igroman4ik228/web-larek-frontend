import {
	ApiListResponse,
	ILarekApi,
	IOrder,
	IOrderResult,
	IProduct,
} from '../../types/model/larekApi';
import { Api } from '../base/api';

/**
 * Класс для работы с API Веб Ларька
 */
export class LarekApi extends Api implements ILarekApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}
	/**
	 * Получить список товаров
	 */
	async getProductList(): Promise<IProduct[]> {
		return this._get<ApiListResponse<IProduct>>('/product').then((data) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	/**
	 * Получить товар
	 */
	async getProduct(productId: string): Promise<IProduct> {
		return this._get<IProduct>(`/product/${productId}`).then((item) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	/**
	 * Создать заказ
	 */
	async createOrder(order: IOrder): Promise<IOrderResult> {
		if (!order.items.length) {
			throw new Error('Список товаров в заказе пуст');
		}
		return this._post<IOrderResult>('/order', order);
	}
}

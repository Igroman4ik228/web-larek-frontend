import { ApiListResponse, ILarekApi, IOrder, IOrderResult, IProduct } from "../../types/model/larekApi";
import { Api } from "../base/api";

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
        return this._get<ApiListResponse<IProduct>>("/product")
            .then(data =>
                data.items.map((item) => ({
                    ...item,
                    image: this.cdn + item.image
                }))
            );
    }

    /**
     * Получить товар
     * @param id - ID товара
     * @throws {Error} - если товар с данным ID не найден
     */
    async getProduct(id: string): Promise<IProduct> {
        return this._get<IProduct>(`/product/${id}`)
            .then(item => ({
                ...item,
                image: this.cdn + item.image,
            }));
    }

    /**
     * Создать заказ
     * @param order - заказ
     * @returns созданный заказ
     * @throws {Error} - если список товаров в заказе пуст
     * @throws {Error} - если товар с данным ID не найден 
     * @throws {Error} - если неверная сумма заказа 
     * @throws {Error} - если не указан адрес
     */
    async createOrder(order: IOrder): Promise<IOrderResult> {
        if (!order.items.length) {
            throw new Error("Список товаров в заказе пуст");
        }
        return this._post<IOrderResult>("/order", order);
    }
}
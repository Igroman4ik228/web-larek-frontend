import { Api, ApiListResponse } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { CartModel, CatalogModel } from './components/model/cart';
import { CartItemView, CartView } from './components/view/cart';
import './scss/styles.scss';
import { IProduct } from './types';
import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';


const api = new Api(API_URL);
const events = new EventEmitter();

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Все шаблоны
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');


const cartView = new CartView(ensureElement<HTMLElement>(".basket"));
const cartModel = new CartModel(events);
const catalogModel = new CatalogModel();


function renderCart(items: string[]) {
    cartView.render({
        items: items.map(id => {
            const itemView = new CartItemView(cloneTemplate(cardTemplate), events);
            const product = catalogModel.getProduct(id);
            return itemView.render({
                id: product.id,
                title: product.title,
                price: product.price
            });
        })
    });
}

events.on("cart:change", (event: { items: string[] }) => {
    renderCart(event.items);
});

events.on("view:cart-remove", (event: { id: string }) => {
    cartModel.remove(event.id)
});

api.get<ApiListResponse<IProduct>>("/product")
    .then(res => {
        catalogModel.setItems(res.items);
        cartModel.add("90973ae5-285c-4b6f-a6d0-65d1d760b102");
    })
    .catch(err => console.error(err));





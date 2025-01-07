import { EventEmitter } from './components/base/events';
import { CartModel } from './components/model/cart';
import { CatalogModel } from './components/model/catalog';
import { LarekApi } from './components/model/larekApi';
import { CartItemView, CartView } from './components/view/cart';
import { PageView } from './components/view/page';
import './scss/styles.scss';
import { IProduct } from './types/model/larekApi';
import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';


const larekApi = new LarekApi(API_URL);
const events = new EventEmitter();

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Все шаблоны
const catalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cartTemplate = ensureElement<HTMLTemplateElement>('#card-basket');


// Глобальные контейнеры
const page = new PageView(document.body, events);
// const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const cartView = new CartView(ensureElement<HTMLElement>(".basket"));
const cartModel = new CartModel({}, events);
const catalogModel = new CatalogModel();

function renderCart(items: string[]) {
    cartView.render({
        items: items.map(id => {
            const itemView = new CartItemView(cloneTemplate(cartTemplate), events);
            const product = catalogModel.getProduct(id);
            return itemView.render({
                id: product.id,
                title: product.title,
                price: product.price
            });
        })
    });
}

function renderPageProducts(items: IProduct[]) {
    page.render({
        catalog: items.map(item => {
            // const cotalogItem = new CatalogItem(cloneTemplate(catalogTemplate), events);
            return cloneTemplate(catalogTemplate);
        }),
        counter: 0,
        locked: false
    })
}


events.on("model:cart-change", (event: { items: string[] }) => {
    renderCart(event.items);
});

events.on("view:cart-remove", (event: { id: string }) => {
    cartModel.remove(event.id)
});


larekApi.getProducts()
    .then(items => {
        catalogModel.setItems(items);
        console.log(items);
        cartModel.add("48e86fc0-ca99-4e13-b164-b98d65928b53")
        // renderPageProducts(catalogModel.items);
    })
    .catch(err => console.error(err));

import { EventEmitter } from './components/base/events';
import { LarekApi } from './components/larekApi';
import { CartModel } from './components/model/cart';
import { CatalogModel } from './components/model/catalog';
import { CardPreviewView, CardView } from './components/view/card';
import { CartItemView, CartView } from './components/view/cart';
import { ModalView } from './components/view/common/modal';
import { PageView } from './components/view/page';
import './scss/styles.scss';
import { IProduct } from './types/model/larekApi';
import { CategoryColor } from './types/view/card';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/html';

const larekApi = new LarekApi(CDN_URL, API_URL);
const events = new EventEmitter();

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardCartTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const modalTemplate = ensureElement<HTMLTemplateElement>('#modal-container')

// Глобальные контейнеры
const page = new PageView(document.body, events);
const modal = new ModalView(modalTemplate, events);

const catalogModel = new CatalogModel({}, events);
const cartModel = new CartModel({}, events, catalogModel);

const cartView = new CartView(ensureElement<HTMLElement>(".basket"));

function renderCart(items: string[]) {
    return cartView.render({
        items: items.map(id => {
            const itemView = new CartItemView(cloneTemplate(cardCartTemplate), events);
            const product = catalogModel.getProduct(id);
            return itemView.render({
                id: product.id,
                title: product.title,
                price: product.price
            });
        }),
        totalPrice: cartModel.totalPrice
    });
};

function renderPage(items: IProduct[]) {
    page.catalog = items.map(item => renderCard(item));
    page.counter = cartModel.items.size;
};

function renderCard(item: IProduct) {
    const cardView = new CardView(
        cloneTemplate(cardCatalogTemplate),
        { onClick: () => events.emit("view:card-select", { item }) }
    );

    return cardView.render({
        title: item.title,
        image: item.image,
        category: {
            name: item.category,
            color: CategoryColor[item.category as keyof typeof CategoryColor]
        },
        price: item.price
    })
};

function renderCardPreview(item: IProduct) {
    const cardPreviewView = new CardPreviewView(
        cloneTemplate(cardPreviewTemplate),
        { onClick: () => events.emit("view:card-order", { id: item.id }) }
    );

    return cardPreviewView.render({
        title: item.title,
        image: item.image,
        category: {
            name: item.category,
            color: CategoryColor[item.category as keyof typeof CategoryColor]
        },
        price: item.price
    })
};


events.on("view:card-select", (event: { item: IProduct }) => {
    modal.render(
        {
            content: renderCardPreview(event.item)
        }
    );
});

events.on("model:catalog-change", (event: { items: IProduct[] }) => {
    renderPage(event.items);
});

events.on("model:cart-change", (event: { items: string[] }) => {
    renderCart(event.items);
    page.counter = cartModel.items.size;
});

events.on("view:cart-open", () => {
    modal.render(
        {
            content: renderCart([...cartModel.items.keys()])
        }
    )
});

events.on("view:cart-remove", (event: { id: string }) => {
    cartModel.remove(event.id)
});

events.on("view:card-order", (event: { id: string }) => {
    cartModel.add(event.id);
});


// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});


larekApi.getProducts()
    .then(items => {
        catalogModel.setItems(items);

        cartModel.add("854cef69-976d-4c2a-a18c-2aa45046c390");
        cartModel.add("b06cde61-912f-4663-9751-09956c0eed67");
        renderPage(catalogModel.items);
    })
    .catch(err => console.error(err));
import { EventEmitter } from './components/base/events';
import { BasketModel } from './components/models/basket';
import { CatalogModel } from './components/models/catalog';
import { LarekApi } from './components/models/larekApi';
import { OrderModel } from './components/models/order';
import { ModalView } from './components/view/common/modal';
import { PageView } from './components/view/page';
import './scss/styles.scss';
import { ModalStates, ModelStates, ViewStates } from './types';
import { IOrderResult, IProduct } from './types/model/larekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement } from './utils/html';

// Базовые компоненты
const larekApi = new LarekApi(CDN_URL, API_URL);
const events = new EventEmitter();

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Модели
const catalogModel = new CatalogModel(events, larekApi);
const basketModel = new BasketModel(events, catalogModel);
const orderModel = new OrderModel(events, larekApi, basketModel);


// Все шаблоны
const modalTemplate = ensureElement<HTMLElement>('#modal-container')


// Отображения
const modalView = new ModalView(modalTemplate, events)
const page = new PageView(document.body, events)



/**
 * Presenter (обработчики событий)
 */
events.on(ModelStates.catalogChange, (event: { items: IProduct[], totalPrice: number }) => {
    // basketModel.add(event.items[0].id);
    console.log(basketModel.items);
})

events.on(ModelStates.createOrder, (event: { item: IOrderResult }) => {
    console.log(event.item);
})


events.on(ViewStates.basketOpen, () => {
    console.log("open basket");
})


// Блокируем/разблокируем прокрутку страницы если открыта/закрыта модалка
events.on(ModalStates.open, () => {
    page.locked = true;
});
events.on(ModalStates.close, () => {
    page.locked = false;
});



// Загружаем список товаров
catalogModel
    .loadProducts()
    .then(() => page.render())
    .catch(err => console.error(err))


// *Test order
// orderModel.order = {
//     payment: "online",
//     email: "test@test.ru",
//     phone: "+71234567890",
//     address: "Spb Vosstania 1",
//     total: 2200,
//     items: [
//         "854cef69-976d-4c2a-a18c-2aa45046c390",
//         "c101ab44-ed99-4a54-990d-47aa2bb4e7d9"
//     ]
// }

// orderModel.createOrder().then(() => console.log(console.log("!!!", basketModel.totalPrice)));


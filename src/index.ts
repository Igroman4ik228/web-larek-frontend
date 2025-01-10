import { EventEmitter } from "./components/base/events";
import { BasketModel } from "./components/models/basket";
import { CatalogModel } from "./components/models/catalog";
import { LarekApi } from "./components/models/larekApi";
import { BasketItemView, BasketView } from "./components/view/basket";
import { CardPreviewView, CardView } from "./components/view/card";
import { ModalView } from "./components/view/common/modal";
import { PageView } from "./components/view/page";
import "./scss/styles.scss";
import { ModalStates, ModelStates, ViewStates } from "./types";
import { IOrderResult, IProduct } from "./types/model/larekApi";
import { CategoryColor } from "./types/view/card";
import { API_URL, CDN_URL } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/html";
import { Templates } from "./utils/template";

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
// const orderModel = new OrderModel(events, larekApi, basketModel);


// Отображения
const modalView = new ModalView(Templates.modal, events)
const pageView = new PageView(document.body, events)
const basketView = new BasketView(
    ensureElement<HTMLElement>(".basket"),
    {
        onClick: () => {
            if (basketModel.validateTotalPrice())
                events.emit(ViewStates.basketSubmit)
        }
    }
)


/**
 * Presenter (обработчики событий)
 */
function renderCard(item: IProduct): HTMLElement {
    const cardView = new CardView(
        cloneTemplate(Templates.catalog),
        { onClick: () => events.emit(ViewStates.cardSelect, { id: item.id }) }
    );

    return cardView.render({
        category: {
            name: item.category,
            colorClass: CategoryColor[item.category as keyof typeof CategoryColor]
        },
        title: item.title,
        image: item.image,
        price: item.price
    })
}


function renderCardPreview(item: IProduct): HTMLElement {
    const cardPreviewView = new CardPreviewView(
        cloneTemplate(Templates.cardPreview),
        {
            onClick: () => {
                let eventName = ViewStates.cardOrder
                if (basketModel.has(item.id)) {
                    eventName = ViewStates.basketItemRemove
                }

                events.emit(eventName, { id: item.id })

                // Обновление после уведомления событий
                cardPreviewView.hasInBasket = basketModel.has(item.id)
            }
        }
    );

    return cardPreviewView.render({
        category: {
            name: item.category,
            colorClass: CategoryColor[item.category as keyof typeof CategoryColor]
        },
        title: item.title,
        image: item.image,
        price: item.price,
        description: item.description,
        hasInBasket: basketModel.has(item.id)
    })
}

function renderBasketItem(id: string): HTMLElement {
    const basketItemView = new BasketItemView(
        cloneTemplate(Templates.basketItem),
        events
    );

    const product = catalogModel.getProduct(id);

    return basketItemView.render({
        index: basketModel.getIndex(id),
        id: product.id,
        title: product.title,
        price: product.price,
    });
}

function renderBasket(ids: string[]): HTMLElement {
    return basketView.render({
        items: ids.map(id => renderBasketItem(id)),
        totalPrice: basketModel.totalPrice
    })
}

events.on(ModelStates.catalogChange, (event: { items: IProduct[] }) => {
    pageView.catalog = event.items.map(renderCard);
})

events.on(ModelStates.orderCreate, (event: { item: IOrderResult }) => {
    console.log(event.item);
})

events.on(ModelStates.basketChange, (event: { ids: string[] }) => {
    renderBasket(event.ids);
    pageView.counter = basketModel.items.length;
})


events.on(ViewStates.basketItemRemove, (event: { id: string }) => {
    basketModel.remove(event.id)
})

events.on(ViewStates.cardSelect, (event: { id: string }) => {
    const product = catalogModel.getProduct(event.id)
    modalView.render({
        content: renderCardPreview(product)
    })
})

events.on(ViewStates.basketOpen, () => {
    modalView.render({
        content: renderBasket([...basketModel.items])
    })
})

events.on(ViewStates.cardOrder, (event: { id: string }) => {
    basketModel.add(event.id);

    console.log(basketModel.totalPrice);
})

// Блокируем/разблокируем прокрутку страницы если открыта/закрыта модалка
events.on(ModalStates.open, () => {
    pageView.locked = true;
})
events.on(ModalStates.close, () => {
    pageView.locked = false;
})


// Загружаем список товаров
catalogModel
    .loadProducts()
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


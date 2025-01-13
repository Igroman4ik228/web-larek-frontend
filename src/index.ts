import { EventEmitter } from "./components/base/events";
import { BasketModel } from "./components/models/basket";
import { CatalogModel } from "./components/models/catalog";
import { LarekApi } from "./components/models/larekApi";
import { LocalStorageModel } from "./components/models/localStorage";
import { OrderModel } from "./components/models/order";
import { BasketItemView, BasketView } from "./components/view/basket";
import { CardPreviewView, CardView } from "./components/view/card";
import { ModalView } from "./components/view/modal";
import { OrderContactView, OrderPaymentView } from "./components/view/order";
import { PageView } from "./components/view/page";
import { SuccessView } from "./components/view/success";
import "./scss/styles.scss";
import { ModalStates, ModelStates, ViewStates } from "./types";
import { IProduct } from "./types/model/larekApi";
import { CategoryColor } from "./types/view/card";
import { IOrderForm, PaymentMethod } from "./types/view/order";
import { API_URL, CDN_URL } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/html";
import { Templates } from "./utils/template";

/**
 * Базовые компоненты
 */
const larekApi = new LarekApi(CDN_URL, API_URL);
const events = new EventEmitter();

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

/**
 * Модели
 */
const catalogModel = new CatalogModel(events, larekApi);
const localStorageModel = new LocalStorageModel();
const basketModel = new BasketModel(events, catalogModel, localStorageModel);
const orderModel = new OrderModel(events, larekApi, basketModel);

/**
 * Отображения
 */
// Глобальные компоненты
const modalView = new ModalView(Templates.modal, events)
const pageView = new PageView(document.body, events)

// Переисполняемые компоненты
const basketView = new BasketView(
    ensureElement<HTMLElement>(".basket"),
    {
        onClick: () => {
            // Валидация корзины
            if (basketModel.isValid)
                events.emit(ViewStates.basketSubmit);
        }
    }
)
const orderPaymentView = new OrderPaymentView(
    cloneTemplate(Templates.orderPayment),
    events,
    {
        onClickCash: () => events.emit(ViewStates.orderPaymentChange, { field: "payment", value: "cash" }),
        onClickOnline: () => events.emit(ViewStates.orderPaymentChange, { field: "payment", value: "online" })
    }
)
const orderContactView = new OrderContactView(cloneTemplate(Templates.orderContacts), events)
const successView = new SuccessView(
    cloneTemplate(Templates.success),
    { onClick: () => modalView.close() }
);

/**
 * Presenter (обработчики событий)
 */
// Изменилось состояние каталога
events.on(ModelStates.catalogChange, () => {
    pageView.catalog = catalogModel.products.map(renderCard);
})

// Изменилось состояние корзина
events.on(ModelStates.basketChange, () => {
    renderBasket(basketModel.productIds);
    pageView.counter = basketModel.productIds.length;
})

// Изменилось состояние метода оплаты
events.on(ModelStates.paymentMethodChange, () => {
    orderPaymentView.payment = orderModel.order.payment as PaymentMethod;
})

// Изменилось состояние валидации формы
events.on(ModelStates.formErrorChange, () => {
    const { payment, address, email, phone } = orderModel.formErrors;

    // Объединяем логику в один блок
    const views = [
        { view: orderPaymentView, errors: [payment, address] },
        { view: orderContactView, errors: [email, phone] }
    ];

    views.forEach(({ view, errors }) => {
        view.valid = errors.every(error => !error);
        view.errors = errors.filter(Boolean).join("; ");
    });
})

// Открытие модального окна успеха
events.on(ModelStates.successOpen, (result: { total: number }) => {
    modalView.render({
        content: successView.render({
            totalPrice: result.total
        })
    })
})


// Удаление товара из корзины
events.on(ViewStates.basketItemRemove, (event: { id: string }) => {
    basketModel.remove(event.id)
})

// Открытие карточки
events.on(ViewStates.cardSelect, (event: { id: string }) => {
    const product = catalogModel.getProduct(event.id)
    modalView.render({
        content: renderCardPreview(product)
    })
})

// Добавление товара в корзину
events.on(ViewStates.cardOrder, (event: { id: string }) => {
    basketModel.add(event.id);
})

// Открытие корзины
events.on(ViewStates.basketOpen, () => {
    modalView.render({
        content: renderBasket([...basketModel.productIds])
    })
})

// Открытие формы оплаты
events.on(ViewStates.basketSubmit, () => {
    const { payment, address } = orderModel.formErrors;

    console.log(payment, address);
    modalView.render({
        content: orderPaymentView.render({
            valid: orderModel.validateOrder(["payment", "address"]),
            errors: [payment, address].filter(Boolean).join("; ")
        })
    })
})

// Изменение полей формы оплаты
events.on(/^view:order\..*-change/, (event: { field: keyof IOrderForm, value: string }) => {
    orderModel.setOrderField(event.field, event.value);
})

// Открытие формы контактов
events.on(ViewStates.orderPaymentSubmit, () => {
    const { email, phone } = orderModel.formErrors;

    modalView.render({
        content: orderContactView.render({
            valid: orderModel.validateOrder(["email", "phone"]),
            errors: [email, phone].filter(Boolean).join("; ")
        })
    })
})

// Изменение полей формы контактов
events.on(/^view:contacts\..*-change/, (event: { field: keyof IOrderForm, value: string }) => {
    orderModel.setOrderField(event.field, event.value);
})

// Создание заказа
events.on(ViewStates.orderContactsSubmit, () => {
    orderModel.createOrder()
})

// Блокируем/разблокируем прокрутку страницы если открыта/закрыта модалка
events.on(ModalStates.open, () => {
    pageView.locked = true;
})
events.on(ModalStates.close, () => {
    pageView.locked = false;
})

// Загружаем список товаров
catalogModel.loadProductList()
    .then(() => {
        // Загружаем состояние корзины
        basketModel.restoreState();
    })


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
                // Проверка на отсутствие цены товара
                if (catalogModel.getProduct(item.id).price === null)
                    return;

                if (basketModel.has(item.id))
                    events.emit(ViewStates.basketItemRemove, { id: item.id })
                else
                    events.emit(ViewStates.cardOrder, { id: item.id })

                // Обновление данных после события
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
        totalPrice: basketModel.totalPrice,
        valid: basketModel.isValid
    })
}
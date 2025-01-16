import { EventEmitter } from "./components/base/events";
import { BasketModel } from "./components/models/basket";
import { CatalogModel } from "./components/models/catalog";
import { LarekApi } from "./components/models/larekApi";
import { LocalStorageModel } from "./components/models/localStorage";
import { OrderModel } from "./components/models/order";
import { BasketView } from "./components/view/basket";
import { CardBasketView, CardPreviewView, CardView } from "./components/view/card";
import { ModalView } from "./components/view/modal";
import { OrderContactView, OrderPaymentView } from "./components/view/order";
import { PageView } from "./components/view/page";
import { SuccessView } from "./components/view/success";
import "./scss/styles.scss";
import { BasketItemRemoveEvent, CardOrderEvent, CardSelectEvent, FormFieldChangeEvent, ModalStates, ModelStates, SuccessOpenEvent, ViewStates } from "./types";
import { IProduct } from "./types/model/larekApi";
import { CategoryColor } from "./types/view/card";
import { PaymentMethod } from "./types/view/order";
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
const localStorageModel = new LocalStorageModel();
const catalogModel = new CatalogModel(events, larekApi);
const basketModel = new BasketModel(events, catalogModel, localStorageModel);
const orderModel = new OrderModel(events, larekApi, basketModel);

/**
 * Отображения
 */
const modalView = new ModalView(Templates.modal, events)
const pageView = new PageView(document.body, events)
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
const orderPaymentView = new OrderPaymentView(cloneTemplate(Templates.orderPayment), events)
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
    basketModel.persistState();
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
events.on<SuccessOpenEvent>(ModelStates.successOpen, (event: SuccessOpenEvent) => {
    modalView.render({
        content: successView.render({
            totalPrice: event.totalPrice
        })
    })
})


// Удаление товара из корзины
events.on<BasketItemRemoveEvent>(ViewStates.basketItemRemove, (event: BasketItemRemoveEvent) => {
    basketModel.remove(event.productId);
})

// Открытие карточки
events.on<CardSelectEvent>(ViewStates.cardSelect, (event: CardSelectEvent) => {
    const product = catalogModel.getProduct(event.productId);
    modalView.render({
        content: renderCardPreview(product)
    });
})

// Добавление товара в корзину
events.on<CardOrderEvent>(ViewStates.cardOrder, (event: CardOrderEvent) => {
    basketModel.add(event.productId);
})

// Открытие корзины
events.on(ViewStates.basketOpen, () => {
    modalView.render({
        content: renderBasket(basketModel.productIds)
    })
})

// Открытие формы оплаты
events.on(ViewStates.basketSubmit, () => {
    const { payment, address } = orderModel.formErrors;
    modalView.render({
        content: orderPaymentView.render({
            valid: orderModel.validateOrder(["payment", "address"]),
            errors: [payment, address].filter(Boolean).join("; ")
        })
    })
})

// Изменение полей формы оплаты
events.on<FormFieldChangeEvent>(/^view:order\..*-change/, (event: FormFieldChangeEvent) => {
    orderModel.setOrderField(event.field, event.value);
})

// Открытие формы контактов
events.on(ViewStates.orderPaymentSubmit, () => {
    // Дополнительная проверка, так как на кнопку можно нажать, если в коде элемента убрать disabled
    if (!orderModel.validateOrder(["payment", "address"])) return;

    const { email, phone } = orderModel.formErrors;
    modalView.render({
        content: orderContactView.render({
            valid: orderModel.validateOrder(["email", "phone"]),
            errors: [email, phone].filter(Boolean).join("; ")
        })
    })
})

// Изменение полей формы контактов
events.on<FormFieldChangeEvent>(/^view:contacts\..*-change/, (event: FormFieldChangeEvent) => {
    orderModel.setOrderField(event.field, event.value);
})

// Создание заказа
events.on(ViewStates.orderContactsSubmit, () => {
    // Дополнительная проверка, так как на кнопку можно нажать, если в коде элемента убрать disabled
    if (!orderModel.validateOrder()) return;

    orderModel.prepareOrder();
    orderModel.createOrder();
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
        { onClick: () => events.emit<CardSelectEvent>(ViewStates.cardSelect, { productId: item.id }) }
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
                    events.emit<BasketItemRemoveEvent>(ViewStates.basketItemRemove, { productId: item.id })
                else
                    events.emit<CardOrderEvent>(ViewStates.cardOrder, { productId: item.id })

                // Обновление карточки после события
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

function renderCardBasket(productId: string): HTMLElement {
    const cardBasketView = new CardBasketView(
        cloneTemplate(Templates.cardBasket),
        events
    );

    const product = catalogModel.getProduct(productId);
    return cardBasketView.render({
        index: basketModel.getIndex(productId),
        id: product.id,
        title: product.title,
        price: product.price,
    });
}

function renderBasket(productIds: string[]): HTMLElement {
    return basketView.render({
        items: productIds.map(productId => renderCardBasket(productId)),
        totalPrice: basketModel.totalPrice,
        valid: basketModel.isValid
    })
}
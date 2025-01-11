import { EventEmitter } from "./components/base/events";
import { BasketModel } from "./components/models/basket";
import { CatalogModel } from "./components/models/catalog";
import { LarekApi } from "./components/models/larekApi";
import { OrderModel } from "./components/models/order";
import { BasketItemView, BasketView } from "./components/view/basket";
import { CardPreviewView, CardView } from "./components/view/card";
import { ModalView } from "./components/view/common/modal";
import { SuccessView } from "./components/view/common/success";
import { OrderContactView, OrderPaymentView } from "./components/view/order";
import { PageView } from "./components/view/page";
import "./scss/styles.scss";
import { ModalStates, ModelStates, ViewStates } from "./types";
import { IOrderResult, IProduct } from "./types/model/larekApi";
import { FormErrors } from "./types/model/order";
import { CategoryColor } from "./types/view/card";
import { IOrderForm } from "./types/view/order";
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
const orderModel = new OrderModel(events, larekApi, basketModel);



// Отображения
const modalView = new ModalView(Templates.modal, events)
const pageView = new PageView(document.body, events)
const basketView = new BasketView(
    ensureElement<HTMLElement>(".basket"),
    {
        onClick: () => {
            // Валидация цены корзины
            if (basketModel.totalPrice > 0)
                events.emit(ViewStates.basketSubmit)
        }
    }
)
const orderPaymentView = new OrderPaymentView(
    cloneTemplate(Templates.orderPayment),
    events,
    {
        onClickCash: () => {
            events.emit("view:order.payment-change", { field: "payment", value: "cash" });
            orderPaymentView.payment = "cash";
        },
        onClickOnline: () => {
            events.emit("view:order.payment-change", { field: "payment", value: "online" });
            orderPaymentView.payment = "online";
        }
    }
)
const orderContactView = new OrderContactView(cloneTemplate(Templates.orderContacts), events)
const successView = new SuccessView(
    cloneTemplate(Templates.success),
    { onClick: () => { modalView.close(); } }
);

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
        totalPrice: basketModel.totalPrice
    })
}

events.on(ModelStates.catalogChange, () => {
    pageView.catalog = catalogModel.products.map(renderCard);
})

events.on(ModelStates.basketChange, () => {
    renderBasket(basketModel.productIds);
    pageView.counter = basketModel.productIds.length;
})

// Изменилось состояние валидации формы оплаты
events.on(ModelStates.formPaymentErrorChange, (errors: FormErrors) => {
    const { payment, address } = errors;
    orderPaymentView.valid = orderModel.isValidOrderPayment();
    orderPaymentView.errors = Object.values({ payment, address }).filter(i => !!i).join('; ');
})

// Изменилось состояние валидации формы контактов
events.on(ModelStates.formContactErrorChange, (errors: FormErrors) => {
    const { email, phone } = errors;
    orderContactView.valid = orderModel.isValidOrderContact();
    orderContactView.errors = Object.values({ email, phone }).filter(i => !!i).join('; ');
})

events.on(ModelStates.orderCreate, (orderResult: IOrderResult) => {
    modalView.render({
        content: successView.render({
            totalPrice: orderResult.total,
        })
    })
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

events.on(ViewStates.cardOrder, (event: { id: string }) => {
    basketModel.add(event.id);
})

events.on(ViewStates.basketOpen, () => {
    modalView.render({
        content: renderBasket([...basketModel.productIds])
    })
})

events.on(ViewStates.basketSubmit, () => {
    modalView.render({
        content: orderPaymentView.render({
            valid: orderModel.isValidOrderPayment(),
            errors: []
        })
    })
})

events.on(ViewStates.orderPaymentSubmit, () => {
    modalView.render({
        content: orderContactView.render({
            valid: orderModel.isValidOrderContact(),
            errors: []
        })
    })
})

events.on(ViewStates.orderContactSubmit, () => {
    orderModel.createOrder();

    // Очистка полей форм
    orderPaymentView.render({
        payment: "",
        address: "",
        valid: false,
        errors: []
    })

    orderContactView.render({
        email: "",
        phone: "",
        valid: false,
        errors: []
    })

})

events.on(/^view:order\..*-change/, (event: { field: keyof IOrderForm, value: string }) => {
    orderModel.setOrderField(event.field, event.value);
})

events.on(/^view:contacts\..*-change/, (event: { field: keyof IOrderForm, value: string }) => {
    orderModel.setOrderField(event.field, event.value);
})

// Блокируем/разблокируем прокрутку страницы если открыта/закрыта модалка
events.on(ModalStates.open, () => {
    pageView.locked = true;
})
events.on(ModalStates.close, () => {
    pageView.locked = false;
})

// Загружаем список товаров
catalogModel.loadProducts();
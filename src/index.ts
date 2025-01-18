import { EventEmitter } from "./components/base/events";
import { BasketModel } from "./components/models/basket";
import { CatalogModel } from "./components/models/catalog";
import { LarekApi } from "./components/models/larekApi";
import { UserDataModel } from "./components/models/userData";
import { BasketView } from "./components/view/basket";
import { CardBasketView } from "./components/view/cards/basket";
import { CardView } from "./components/view/cards/card";
import { CardPreviewView } from "./components/view/cards/preview";
import { ModalView } from "./components/view/common/modal";
import { ContactView } from "./components/view/contacts";
import { PageView } from "./components/view/page";
import { PaymentView } from "./components/view/payment";
import { SuccessView } from "./components/view/success";
import "./scss/styles.scss";
import { BasketItemRemoveEvent, CardOrderEvent, CardSelectEvent, FormFieldChangeEvent, ModalStates, ModelStates, SuccessOpenEvent, UserDataForm, ValidateResult, ViewStates } from "./types";
import { IOrder, IProduct } from "./types/model/larekApi";
import { CategoryColor } from "./types/view/cards/card";
import { PaymentMethod } from "./types/view/payment";
import { API_URL, CDN_URL, TEMPLATES } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/html";

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
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events, catalogModel);
const userDataModel = new UserDataModel(events);

/**
 * Отображения
 */
const modalView = new ModalView(TEMPLATES.modal, events)
const pageView = new PageView(document.body, events)
const basketView = new BasketView(
    ensureElement<HTMLElement>(".basket"),
    {
        onClick: () => {
            // Валидация корзины, чтобы нельзя было заказать пустую
            if (basketModel.isValid)
                events.emit(ViewStates.basketSubmit);
        }
    }
)
const paymentView = new PaymentView(cloneTemplate(TEMPLATES.orderPayment), events)
const contactView = new ContactView(cloneTemplate(TEMPLATES.orderContacts), events)
const successView = new SuccessView(
    cloneTemplate(TEMPLATES.success),
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
    paymentView.payment = userDataModel.userData.payment as PaymentMethod;
    events.emit(ModelStates.formErrorChange);
})

// Изменилось состояние валидации формы
events.on(ModelStates.formErrorChange, () => {
    const paymentValidationResult = validateFields(["payment", "address"]);
    const contactValidationResult = validateFields(["email", "phone"]);

    // Объединяем логику в один блок
    const viewsData = [
        {
            view: paymentView,
            isValid: paymentValidationResult.isValid,
            errorsData: paymentValidationResult.errors
        },
        {
            view: contactView,
            isValid: contactValidationResult.isValid,
            errorsData: contactValidationResult.errors
        }
    ];

    viewsData.forEach(({ view, isValid, errorsData }) => {
        view.valid = isValid;
        view.errors = errorsData.join("; ");
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
    const { isValid, errors } = validateFields(["payment", "address"]);
    modalView.render({
        content: paymentView.render({
            valid: isValid,
            errors: errors.join("; ")
        })
    })
})

// Изменение полей формы оплаты
events.on<FormFieldChangeEvent>(/^view:order\..*-change/, (event: FormFieldChangeEvent) => {
    userDataModel.set(event.field, event.value);
    events.emit(ModelStates.formErrorChange);
})

// Открытие формы контактов
events.on(ViewStates.orderPaymentSubmit, () => {
    // Дополнительная проверка, так как на кнопку можно нажать, если в коде элемента убрать disabled
    const { isValid } = validateFields(["payment", "address"]);
    if (!isValid) return;

    const validationResult = validateFields(["email", "phone"]);
    modalView.render({
        content: contactView.render({
            valid: validationResult.isValid,
            errors: validationResult.errors.join("; ")
        })
    })
})

// Изменение полей формы контактов
events.on<FormFieldChangeEvent>(/^view:contacts\..*-change/, (event: FormFieldChangeEvent) => {
    userDataModel.set(event.field, event.value);
    events.emit(ModelStates.formErrorChange);
})

// Создание заказа
events.on(ViewStates.orderContactsSubmit, () => {
    // Дополнительная проверка, так как на кнопку можно нажать, если в коде элемента убрать disabled
    const { isValid } = validateFields()
    if (!isValid) return;

    // Создание заказа
    const order: IOrder = {
        payment: userDataModel.userData.payment,
        address: userDataModel.userData.address,
        email: userDataModel.userData.email,
        phone: userDataModel.userData.phone,
        total: basketModel.totalPrice,
        items: basketModel.productIds
    }

    larekApi.createOrder(order)
        .then(result => {
            // Очистка корзины
            basketModel.clear();

            events.emit<SuccessOpenEvent>(ModelStates.successOpen, { totalPrice: result.total });
        })
        .catch(err => console.error(err));
})

// Блокируем/разблокируем прокрутку страницы если открыта/закрыта модалка
events.on(ModalStates.open, () => {
    pageView.locked = true;
})
events.on(ModalStates.close, () => {
    pageView.locked = false;
})

larekApi.getProductList()
    .then(products => catalogModel.products = products)
    .catch(err => console.error(err))


function validateFields(fields: (keyof UserDataForm)[] = []): ValidateResult {
    const validationResults = fields.length === 0 ?
        userDataModel.validate() :
        userDataModel.validate(fields);

    const errors = Object.values(validationResults).filter(Boolean);
    return { isValid: errors.length === 0, errors };
}

function renderCard(item: IProduct): HTMLElement {
    const cardView = new CardView(
        cloneTemplate(TEMPLATES.catalog),
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
        cloneTemplate(TEMPLATES.cardPreview),
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
        cloneTemplate(TEMPLATES.cardBasket),
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
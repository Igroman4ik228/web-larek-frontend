# Проектная работа "Веб-ларек"

**Стек**: HTML, SCSS, TS, Webpack

**Структура проекта**:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом
- src/components/models/ — папка с моделями
- src/components/view/ — папка с представлениями

**Важные файлы**:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/html.ts — файл с утилитами для работы с HTML
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура
Используется парадигма **MVP** (Model-View-Presenter), которая предполагает 3 слоя приложения:
- Модель (Model) - бизнес-логика, хранение и изменение данных
- Представление (View) - отображение данных и передача пользовательского ввода презентеру
- Презентер (Presenter) - связующее звено, посредник между моделью и представлением

Также используется событийно-ориентированный подход к передаче данных между слоями.

## Базовые компоненты

### 1. API (``Api``)
Реализует базовый функционал отправки любых запросов на сервер.

**Поля**:
- ``baseUrl: string`` - базовый URL для отправки запросов
- ``_options: RequestInit`` - опции для отправки запросов

**Методы**:
- ``_handleResponse<T>(response: Response)`` - обрабатывает ответ от сервера
- ``_get<T>(uri: string)`` - получить данные с сервера
- ``_post<T>(uri: string, data: object, method: ApiPostMethods)`` - отправить данные на сервер

Типы запросов для отправки данных на сервер: ``type ApiPostMethods = "POST" | "PUT" | "DELETE";``

### 2. Брокер событий (``EventEmitter``)
Обеспечивает работу событий для обмена между данными между компонентами. Список событий описан в перечислениях ``ViewStates`` ``ModalStates`` ``ModelStates`` в файле src/types/index.ts.

Реализует интерфейс:
````ts
interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}
````

Во все классы, которые используют брокер событий передан для корректной работы экземпляр объекта типа ``IEvents`` в конструктор, чтобы не зависеть от конкретной реализации (хоть она сейчас и одна - ``EventEmitter``).

### 3. Компонент представления (``Component``)
Абстрактный класс для реализации представления. Содержит полезные и универсальные методы для работы с DOM-элементами. Он принимает в качестве параметра корневой DOM-элемент в котором будут рендериться компоненты отображения.

## Слой модель

### 1. Реализация API (``LarekApi``)
Реализует работу с API Веб Ларька для получения и отправки данных на бэкенд. Для работы с API используется базовый класс ``Api``.

В файле api.json в корне проекта можно посмотреть актуальную коллекцию для программы Postman. Базовые интерфейсы для работы с API Веб Ларька описаны в файле src/types/model/larekApi.ts. 

**Поля**:
- ``cdn: string`` - ссылка на CDN для изображений товаров

**Методы**:
- ``getProducts(): Promise<IProduct[]>`` - запрос на получение списка товаров
- ``getProduct(id: string): Promise<IProduct>`` - запрос на получение товара по id
- ``createOrder(order: IOrder): Promise<IOrderResult>`` - запрос на создание заказа


### 2. Модель каталога (``CatalogModel``)
Реализует логику работы с каталогом товаров.

**Поля**:
- ``_products: IProduct[]`` — список товаров

**Методы**:
- *set* ``products(value: IProduct[])`` - установить список товаров (вызывает событие - обновление списка товаров)
- *get* ``products(): IProduct[]`` - получить список товаров

### 3. Модель корзины (``BasketModel``)
Реализует логику работы с корзиной. В неё нельзя добавлять одинаковые товары. Требует в конструктор передать экземпляр модели каталога для получения информации о товарах при расчете стоимости корзины.

**Поля**:
- ``_productIds: Set<string>`` — список уникальных id товаров в корзине

**Методы**:
- *get* ``productIds(): string[]`` — получить список id товаров в корзине
- *get* ``totalPrice(): number`` — получить общую стоимость товаров в корзине (каждый раз вычисляется по текущему списку товаров в корзине)
- ``add(productId: string)``— добавить товар в корзину (вызывает событие - изменение корзины)
- ``remove(productId: string)`` — удалить товар из корзины (вызывает событие - изменение корзины)
- ``has(productId: string)`` — проверить наличие товара в корзине
- ``getIndex(productId: string)`` — получить индекс элемента в корзине
- ``clear()`` — очистить корзину (вызывает событие - изменение корзины)


### 4. Модель данных пользователя (``UserDataModel``)
Реализует логику работы с данными пользователя.

**Поля**:
- ``_userData: IUserData`` - данные пользователя (способ оплаты,
адрес, почта, телефон)
- ``VALIDATIONS: Record<keyof UserDataForm, (value: string) => string | null>`` - содержит правила валидации для данных пользователя

**Методы**:
- *get* ``userData(): IUserData`` - получить данные пользователя
- ``set(field: keyof UserDataForm, value: string)`` - установить данные пользователя по указанному полю (вызывает событие - изменение данных пользователя)
- ``validate(fields: (keyof UserDataForm)[]): FormErrors`` - валидация данных пользователя по указанным полям и возврат ошибок


## Слой представление
Компоненты представления наследуются от базового класса ``Component`` и реализуют специфическую логику визуализации данных и обработки пользовательских запросов.

Для каждого компонента написаны сеттеры в соответствии с полями данных, которые описаны в интерфейсе компонента.

### 1. Страница (``PageView``)
Реализует визуализацию каталога товаров на главной странице, счетчик товаров в корзине и блокировку/разблокировку прокрутки страницы. 

**Данные для визуализации**:
````ts
interface IPageData {
    catalog: HTMLElement[];
    counter: number;
    locked: boolean;
}
````

**Используемые элементы разметки**:
- ``.gallery`` - контейнер для каталога товаров
- ``.header__basket-counter`` - счетчик товаров в корзине
- ``.header__basket`` - кнопка открытия корзины
- ``.page__wrapper`` - контейнер для блокировки прокрутки страницы при открытом модальном окне

### 2. Модальное окно (``ModalView``)
Реализует визуализацию модального окна. Это один из базовых компонентов представления для данного проекта. В нем реализована логика открытия и закрытия модального окна. В данный компонент передается любая разметка, которая должна отображаться в модальном окне. 

Важно учесть, что при открытии/закрытии модального окна меняется состояние блокировки/разблокировки прокрутки страницы.

**Данные для визуализации**:
````ts
interface IModalData {
    content: HTMLElement | null;
}
````

**Используемые элементы разметки**:
- ``.modal__close`` - кнопка закрытия модального окна
- ``.modal__content`` - контейнер для содержимого модального окна

### 3. Базовая карточка товаров (``BaseCardView``)
Реализует базовую визуализацию карточки товаров. Объединяет повторяющиеся элементы и логику для них всех карточек. Используется в карточках товаров: каталога, предпросмотра и корзине.

**Данные для визуализации**:
````ts
interface IBaseCardData {
    title: string;
    price: number | null;
}
````

**Используемые элементы разметки**:
- ``.card__title`` - название товара
- ``.card__price`` - стоимость товара

### 4. Карточка товаров в каталоге (``CardView``)
Реализует визуализацию карточки товаров в каталоге, отображаемые на главной странице.

**Данные для визуализации**:
````ts
interface ICardData extends IBaseCardData {
    category: ICategory;
    image: string;
}
````

**Используемые элементы разметки**:
- ``.card__category`` - категория товара
- ``.card__image`` - изображение товара

### 5. Карточка товаров в предпросмотре (``CardPreviewView``)
Реализует визуализацию карточки товаров в предпросмотре.  

**Данные для визуализации**:
````ts
interface ICardPreviewData extends IBaseCardData {
    category: ICategory;
    image: string;
    description: string;
    hasInBasket: boolean;
}
````

**Используемые элементы разметки**:
- ``.card__category`` - категория товара
- ``.card__image`` - изображение товара
- ``.card__text`` - описание товара
- ``.card__button`` - кнопка добавления/удаления товара в корзину

### 6. Карточка товаров в корзине (``CardBasketView``)
Реализует визуализацию карточки товаров в корзине.

**Данные для визуализации**:
````ts
interface ICardBasketData extends IBaseCardData {
    index: number;
    id: string;
}
````

**Используемые элементы разметки**:
- ``.card__index`` - индекс товара в корзине
- ``.card__button`` - кнопка удаления товара из корзины

### 7. Корзина (``BasketView``)
Реализует визуализацию карточки товаров в корзине.

**Данные для визуализации**:
````ts
interface IBasketData {
    items: HTMLElement[];
    totalPrice: number;
    valid: boolean;
}
````

**Используемые элементы разметки**:
- ``.basket__list`` - список товаров в корзине
- ``.basket__price`` - стоимость товаров в корзине
- ``.button`` - кнопка закрытия корзины


### 8. Форма (``FormView``)
Реализует визуализацию формы. Это один из базовых компонентов представления для данного проекта. В нём реализована логика взаимодействия пользователя с любой формой (при изменении любого поля формы вызывается событие - изменение данных формы) и отображения ошибок с последующей блокировкой кнопки отправки формы.

В данный компонент передается контейнер, в котором должна располагаться форма, а дополнительная разметка для размещения ошибок валидации и кнопки отправки будут искаться внутри.

**Данные для визуализации**:
````ts
interface IModalData {
    content: HTMLElement | null;
}
````

**Используемые элементы разметки**:
- ``button[type=submit]`` - кнопка отправки формы
- ``.form__error`` - контейнер для ошибок валидации
- ``input`` - поля формы

### 9. Форма оплаты (``PaymentView``)
Реализует визуализацию формы оплаты.

Доступные методы оплаты: 
````ts
type PaymentMethod = "online" | "cash";
````

**Данные для визуализации**:
````ts
interface IPaymentData {
    payment: PaymentMethod;
    address: string;
}
````

**Используемые элементы разметки**:
- ``button[name=card]`` - кнопка выбора оплаты картой
- ``button[name=cash]`` - кнопка выбора оплаты наличными
- ``input[name=address]`` - поле ввода адреса

### 10. Форма контактов  (``ContactView``)
Реализует визуализацию формы контактов.

**Данные для визуализации**:
````ts
interface IContactData {
    email: string;
    phone: string;
}
````

**Используемые элементы разметки**:
- ``input[name=email]`` - поле ввода email
- ``input[name=phone]`` - поле ввода телефона

### 11. Компонент успеха покупки (``SuccessView``)
Реализует визуализацию компонента успеха покупки

**Данные для визуализации**:
````ts
interface ISuccessData {
    totalPrice: number;
}
````

**Используемые элементы разметки**:
- ``.order-success__close`` - кнопка закрытия компонента
- ``.order-success__description`` - текст описания

## Слой презентера (обработка событий)
Презентер реализован в главном файле приложения `src/index.ts` и обрабатывает все основные сценарии приложения.

Все взаимодействия происходят через события, что обеспечивает слабую связанность компонентов.

### Инициализация приложения
- Создание экземпляров базовых компонентов (API, EventEmitter)
- Инициализация моделей (CatalogModel, BasketModel, UserDataModel)
- Создание представлений (ModalView, PageView, BasketView и др.)


### Пример: Добавление товара в корзину

Рассмотрим процесс добавления товара в корзину при клике на кнопку "В корзину":

1. **View → Presenter**: 
   - Пользователь кликает на кнопку "В корзину" в `CardPreviewView`
   - `CardPreviewView` генерирует событие `ViewStates.cardOrder` с id товара

2. **Presenter → Model**:
   - Презентер ловит событие `ViewStates.cardOrder`
   - Вызывает метод `basketModel.add(productId)` для добавления товара в корзину

3. **Model → Presenter**:
   - `BasketModel` добавляет id товара в `_productIds`
   - Генерирует событие `ModelStates.basketChange`

4. **Presenter → View**:
   - Презентер ловит событие `ModelStates.basketChange`
   - Получает обновленные данные из `basketModel` (список товаров, общую стоимость)
   - Вызывает методы обновления представлений.

5. **View**: Представления перерисовываются, отображая актуальное состояние корзины:
   - В корзине появляется новый товар
   - Обновляется общая стоимость
   - Увеличивается счетчик товаров
   - Кнопка "В корзину" меняется на "Убрать из корзины"
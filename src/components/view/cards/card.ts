import { IOnClickEvent } from "../../../types";
import { ICardData, ICategory } from "../../../types/view/cards/card";
import { ensureElement } from "../../../utils/html";
import { BaseCardView } from "./base";

export class CardView extends BaseCardView<ICardData> {
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;

    protected _buttonPreview: HTMLButtonElement | null;

    constructor(container: HTMLElement, actions?: IOnClickEvent) {
        super(container);

        this._category = ensureElement<HTMLElement>(".card__category", container);
        this._image = ensureElement<HTMLImageElement>(".card__image", container);

        this._buttonPreview = container.querySelector(".gallery__item");

        if (!actions?.onClick) return;

        if (this._buttonPreview)
            this._buttonPreview.addEventListener("click", actions.onClick);
        else
            container.addEventListener("click", actions.onClick);
    }

    set category(item: ICategory) {
        this.setText(this._category, item.name);

        const classList = this._category.classList;
        Array.from(classList)
            .filter(cls => cls.startsWith("card__category_"))
            .forEach(cls => classList.remove(cls));

        classList.add(`card__category_${item.colorClass}`);
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }
}
import { IBaseCardData } from "./base";
import { ICategory } from "./card";

export interface ICardPreviewData extends IBaseCardData {
    category: ICategory;
    image: string;
    description: string;
    hasInBasket: boolean;
}
import { IBaseCardData } from './base';

export enum CategoryColor {
	'софт-скил' = 'soft',
	'хард-скил' = 'hard',
	'кнопка' = 'button',
	'дополнительное' = 'additional',
	'другое' = 'other',
}

export interface ICategory {
	name: string;
	colorClass: string;
}

export interface ICardData extends IBaseCardData {
	category: ICategory;
	image: string;
}

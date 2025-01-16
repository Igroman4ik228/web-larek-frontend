import { ensureElement } from "./html";

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

/**
 * Все шаблоны
 */
export const TEMPLATES = {
    modal: ensureElement<HTMLTemplateElement>("#modal-container"),
    catalog: ensureElement<HTMLTemplateElement>("#card-catalog"),
    cardBasket: ensureElement<HTMLTemplateElement>("#card-basket"),
    cardPreview: ensureElement<HTMLTemplateElement>("#card-preview"),
    orderPayment: ensureElement<HTMLTemplateElement>("#order"),
    orderContacts: ensureElement<HTMLTemplateElement>("#contacts"),
    success: ensureElement<HTMLTemplateElement>("#success"),
};
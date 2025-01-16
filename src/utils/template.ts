import { ensureElement } from "./html";

/**
 * Все шаблоны
 */
export const Templates = {
    modal: ensureElement<HTMLTemplateElement>("#modal-container"),
    catalog: ensureElement<HTMLTemplateElement>("#card-catalog"),
    cardBasket: ensureElement<HTMLTemplateElement>("#card-basket"),
    cardPreview: ensureElement<HTMLTemplateElement>("#card-preview"),
    orderPayment: ensureElement<HTMLTemplateElement>("#order"),
    orderContacts: ensureElement<HTMLTemplateElement>("#contacts"),
    success: ensureElement<HTMLTemplateElement>("#success"),
};
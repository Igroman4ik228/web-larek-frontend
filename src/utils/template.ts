import { ensureElement } from "./html";

// Все шаблоны
export const Templates = {
    modal: ensureElement<HTMLTemplateElement>("#modal-container"),
    catalog: ensureElement<HTMLTemplateElement>("#card-catalog"),
    basketItem: ensureElement<HTMLTemplateElement>("#card-basket"),
    cardPreview: ensureElement<HTMLTemplateElement>("#card-preview"),
};
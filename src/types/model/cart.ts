export interface ICartModel {
    items: Map<string, number>; // id, count
    totalPrice: number;
    add(id: string): void;
    remove(id: string): void;
}
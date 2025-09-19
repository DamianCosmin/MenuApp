export interface OrderItem {
    name: string;
    quantity: number;
}

export interface TableItem {
    id: number;
    order: OrderItem[] | null;
}
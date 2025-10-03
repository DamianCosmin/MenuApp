export interface Item {
  categoryID: number;
  itemID: number;
  itemName: string;
  itemPrice: number;
  description: string;
  photoPath: string;
}

export interface OrderItem {
  item: Item;
  quantity: number;
}

export interface Order {
  id: number;
  status: string;
  tableID: number;
  items: OrderItem[];
  total: number;
}

export interface TableItem {
    id: number;
    order: OrderItem[] | null;
}

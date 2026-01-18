export interface Item {
  categoryID: number;
  itemID: number;
  itemName: string;
  itemPrice: number;
  description: string;
  photoPath: string;
}

export function equalItems(a: Item, b: Item) {
  return a.categoryID === b.categoryID && a.itemID === b.itemID;
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
  createdAt?: Date; 
}

// Might delete?
export interface TableItem {
  id: number;
  order: OrderItem[] | null;
}

export interface AnalyticsData {
  totalOrders: number;
  totalRevenue: number;
  totalItems: number;
  occupation: number;
  bestSellers: string[];
}

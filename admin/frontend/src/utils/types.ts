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

export interface AnalyticsData {
    totalOrders: number;
    totalRevenue: number;
    totalTips: number;
    totalItems: number;
    occupation: number;
    bestSellers: string[];
}

export interface OrdersGraphData {
    name: string;
    orders: number;
}

export interface RevenueGraphData {
    name: string;
    revenue: number;
}

export interface PaymentData {
    id: number;
    status: string;
    totalAmount: number;
    totalTips: number;
    method: string;
    tableID: number;
    orders: Order[];
}

export interface User {
    clerkUserId: string;
    email: string;
    createdAt: Date;
    lastLogin: Date;
}

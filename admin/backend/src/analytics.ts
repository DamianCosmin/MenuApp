import { Order, OrderItem, AnalyticsData } from "../../frontend/src/utils/types.js";

export let ANALYTICS = {
    NR_CONFIRMED_ORDERS: 0,
    NR_ITEMS_IN_ORDERS: 0,
    TOTAL_DAILY_REVENUE: 0,
    OCCUPATION_RATE: 0
}

export let totalItems: Map<number, OrderItem>[] = Array.from({length: 7}, () => new Map());
// array index = category ID 
// map key = itemID
// map value = OrderItem

export function updateAnalytics(order: Order, bookedTables: number, totalTables: number) {
    ANALYTICS.NR_CONFIRMED_ORDERS++;
    for (let ordItem of order.items) {
        ANALYTICS.NR_ITEMS_IN_ORDERS += ordItem.quantity;
    
        let categoryID = ordItem.item.categoryID;
        let {item, quantity} = ordItem;
        
        const categoryMap = totalItems[categoryID];
        if (categoryMap) {
            let key = item.itemID;
            let existingItems = categoryMap.get(key);
            if (existingItems) {
                existingItems.quantity += quantity;
            } else {
                categoryMap.set(key, { ...ordItem });
            }
        } else {
            console.log("Invalid category");
        }
    }
    ANALYTICS.TOTAL_DAILY_REVENUE += order.total;
    let occupation = (bookedTables / totalTables) * 100;
    ANALYTICS.OCCUPATION_RATE = Math.round(occupation * 100) / 100;
}

const categoryIdMap: Record<string, number> = {
    burgers: 0,
    pizza: 1,
    pasta: 2,
    coffee: 3,
    softdrinks: 4,
    wines: 5,
    desserts: 6
}

export function sendCustomAnalytics(categoryList: string[]) : AnalyticsData {
    let lowerCategorylist;
    let allowedCategoryIds;
    
    if (categoryList[0] === "ALL") {
        allowedCategoryIds = [0, 1, 2, 3, 4, 5, 6];
    } else if (categoryList[0] === "DRINKS") {
        allowedCategoryIds = ["coffee", "softdrinks", "wines"].map(c => categoryIdMap[c]);
    } else if (categoryList[0] === "MAINS") {
        allowedCategoryIds = ["burgers", "pizza", "pasta"].map(c => categoryIdMap[c]);
    } else {
        lowerCategorylist = categoryList.map(c => c.toLowerCase());
        allowedCategoryIds = lowerCategorylist.map(c => categoryIdMap[c]);
    }

    let itemsRevenue = 0;
    let itemsCount = 0;
    let mergedItems: OrderItem[] = [];

    for (let i = 0; i < 7; i++) {
        if (allowedCategoryIds.includes(i)) {
            const cMap = totalItems[i];

            if (!cMap) {
                continue;
            }

            for (let ordItem of cMap.values()) {
                mergedItems.push(ordItem);
                itemsCount += ordItem.quantity;
                itemsRevenue += (ordItem.item.itemPrice * ordItem.quantity);
            }
        }
    }

    const sorted = mergedItems.sort((a,b) => b.quantity - a.quantity);
    let bestSellers = sorted.slice(0, 3).map(orderItem => orderItem.item.itemName);
    
    while (bestSellers.length < 3) {
        bestSellers.push("N/A");
    }

    return {
        totalOrders: ANALYTICS.NR_CONFIRMED_ORDERS,
        totalRevenue: itemsRevenue,
        totalItems: itemsCount,
        occupation: ANALYTICS.OCCUPATION_RATE,
        bestSellers: bestSellers
    };
}
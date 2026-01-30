import { OrderItem, AnalyticsData } from "../../frontend/src/utils/types.js";
import * as Database from "./database_provider.js";

const categoryIdMap: Record<string, number> = {
    burgers: 0,
    pizza: 1,
    pasta: 2,
    coffee: 3,
    softdrinks: 4,
    wines: 5,
    desserts: 6
}

export async function sendCustomAnalytics(categoryList: string[]) : Promise<AnalyticsData> {
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

    let dbPromises = [];
    for (let i = 0; i < 7; i++) {
        if (allowedCategoryIds.includes(i)) {
            dbPromises.push(Database.getCategoryOrderItems(i));
        }
    }

    const results = await Promise.all(dbPromises);

    for (let categoryItems of results) {
        if (categoryItems == null) {
            continue;
        }

        for (let dbEntry of categoryItems) {
            const {_id, __v, ...ordItem} = dbEntry.toObject();

            mergedItems.push(ordItem);
            itemsCount += ordItem.quantity;
            itemsRevenue += (ordItem.item.itemPrice * ordItem.quantity);
        }
    }

    const sorted = mergedItems.sort((a,b) => b.quantity - a.quantity);
    let bestSellers = sorted.slice(0, 3).map(orderItem => orderItem.item.itemName);
    
    while (bestSellers.length < 3) {
        bestSellers.push("N/A");
    }

    const analytics = await Database.getTodayAnalytics();

    return {
        totalOrders: analytics?.totalOrders || 0,
        totalRevenue: itemsRevenue,
        totalItems: itemsCount,
        occupation: analytics?.occupationRate || 0,
        bestSellers: bestSellers
    };
}
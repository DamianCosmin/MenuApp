import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:food_app/utils/item_model.dart';

const String androidPort = "http://10.0.2.2:5050/api/new_order";
const String iosPort = "http://192.168.1.140:5050/api/new_order";

class OrderProvider extends ChangeNotifier {
  final Map<ItemModel, int> _currentOrder = {};

  Map<ItemModel, int> get currentOrder => _currentOrder;

  void addToOrder(ItemModel item, int quantity) {
    if (_currentOrder.containsKey(item)) {
      _currentOrder[item] = _currentOrder[item]! + quantity;
    } else {
      _currentOrder[item] = quantity;
    }
    notifyListeners();
  }

  void removeFromOrder(ItemModel item) {
    if (_currentOrder[item]! > 1) {
      _currentOrder[item] = _currentOrder[item]! - 1;
    } else if (_currentOrder[item]! == 1) {
      _currentOrder.remove(item);
    }
    notifyListeners();
  }

  void removeItem(ItemModel item) {
    _currentOrder.remove(item);
    notifyListeners();
  }

  void clearOrder() {
    _currentOrder.clear();
    notifyListeners();
  }

  double getOrderTotal() {
    double sum = 0;
    _currentOrder.forEach((item, qty) {
      sum += item.itemPrice * qty;
    });
    return sum;
  }

  Future<void> sendOrderToAdmin(Map<ItemModel, int> order, double total) async {
    final adminUrl = Uri.parse(iosPort);

    final itemsList = order.entries.map((entry) {
      final item = entry.key;
      final quantity = entry.value;
      return {
        "name": item.itemName,
        "price": item.itemPrice,
        "quantity": quantity,
      };
    }).toList();

    if (itemsList.isNotEmpty) {
      try {
        final response = await http.post(
          adminUrl,
          headers: {"Content-Type": "application/json"},
          body: jsonEncode({"items": itemsList, "total": total}),
        );

        print("Response from admin: ${response.body}");
        clearOrder();
      } catch (e) {
        print('Error sending the order: $e');
      }
    }
  }
}

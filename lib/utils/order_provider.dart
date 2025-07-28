import 'package:flutter/material.dart';
import 'package:food_app/utils/item_model.dart';

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
}

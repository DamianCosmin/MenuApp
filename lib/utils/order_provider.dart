import 'package:flutter/material.dart';

class OrderProvider extends ChangeNotifier {
  final Map<int, int> _currentOrder = {};

  Map<int, int> get currentOrder => _currentOrder;

  void addToOrder(int itemIndex, int quantity) {
    if (_currentOrder.containsKey(itemIndex)) {
      _currentOrder[itemIndex] = _currentOrder[itemIndex]! + quantity;
    } else {
      _currentOrder[itemIndex] = quantity;
    }
    notifyListeners();
  }

  void removeItem(int itemIndex) {
    _currentOrder.remove(itemIndex);
    notifyListeners();
  }

  void clearOrder() {
    _currentOrder.clear();
    notifyListeners();
  }
}

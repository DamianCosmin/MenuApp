import 'package:flutter/material.dart';

class CounterProvider extends ChangeNotifier {
  int _count = 1;

  int get count => _count;

  void increment([int max = 20]) {
    if (_count < max) {
      _count++;
      notifyListeners();
    }
  }

  void decrement([int min = 1]) {
    if (_count > min) {
      _count--;
      notifyListeners();
    }
  }

  void resetCounter() {
    _count = 1;
    notifyListeners();
  }
}

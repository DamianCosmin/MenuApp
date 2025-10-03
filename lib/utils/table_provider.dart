import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import 'package:food_app/utils/routes.dart';
import 'package:food_app/utils/item_model.dart';
import 'package:food_app/utils/order_model.dart';

const String tablesUrl = "${API_ROUTE}tables/";

class TableProvider extends ChangeNotifier {
  int _tableID = 0;
  int get tableID => _tableID;
  List<MapEntry<ItemModel, int>> _previousOrder = [];
  List<MapEntry<ItemModel, int>> get previousOrder => _previousOrder;

  Future<bool?> setTableID(int scannedID) async {
    final String param = scannedID.toString();
    final adminUrl = Uri.parse('$tablesUrl$param');
    print(adminUrl);

    try {
      final response = await http.get(
        adminUrl,
        headers: {"Content-Type": "application/json"},
      );

      final data = jsonDecode(response.body);
      print('Response after getting table orders: $data');
      _tableID = scannedID;

      if (data is List && data.isEmpty) {
        return false;
      } else {
        if (data is List && data.isNotEmpty) {
          final orders = data
              .map<OrderModel>(
                (orderJson) =>
                    OrderModel.fromJson(orderJson as Map<String, dynamic>),
              )
              .toList();

          _previousOrder = orders
              .expand<MapEntry<ItemModel, int>>((order) => order.orderItems)
              .toList();

          notifyListeners();
        }

        return true;
      }
    } catch (e) {
      print('Error in getting the table orders: $e');
    }

    return null;
  }

  double getTableTotal() {
    double sum = 0;
    for (final entry in _previousOrder) {
      sum += entry.key.itemPrice * entry.value;
    }
    return sum;
  }
}

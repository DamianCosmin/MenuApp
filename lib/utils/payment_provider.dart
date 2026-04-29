import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';

import 'package:food_app/utils/order_model.dart';
import 'package:food_app/utils/routes.dart';

class PaymentProvider extends ChangeNotifier {
  Future<bool> sendPaymentToAdmin(
    List<OrderModel> orders,
    int table,
    double total,
    double tips,
    String method,
  ) async {
    final adminUrl = Uri.parse('${API_ROUTE}new_payment/');

    if (orders.isNotEmpty) {
      bool canPay = orders.every((o) {
        return o.orderStatus == 'Finished';
      });

      // Test purposes
      orders.map((order) {
        print('${order.orderID} - ${order.orderStatus}');
      }).toList();

      if (canPay) {
        try {
          final response = await http.post(
            adminUrl,
            headers: {"Content-Type": "application/json"},
            body: jsonEncode({
              "totalAmount": double.parse(total.toStringAsFixed(2)),
              "totalTips": double.parse(tips.toStringAsFixed(2)),
              "method": method,
              "tableID": table,
              "orders": orders,
            }),
          );

          if (response.statusCode == 200 || response.statusCode == 201) {
            final data = jsonDecode(response.body);
            // print('Payment data from server: $data');

            return true;
          }
          return false;
        } catch (e) {
          print('Error sending the payment: $e');
        }
      } else {
        print('All orders must be finished to pay');
      }
    }
    return false;
  }
}

import 'package:flutter/material.dart';
import 'package:food_app/utils/order_provider.dart';
import 'package:food_app/utils/style.dart';
import 'package:provider/provider.dart';

class OrderPage extends StatefulWidget {
  const OrderPage({super.key});

  @override
  State<OrderPage> createState() => OrderPageState();
}

class OrderPageState extends State<OrderPage> {
  @override
  Widget build(BuildContext context) {
    final currentOrder = context.watch<OrderProvider>().currentOrder;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'YOUR ORDER',
          style: TextStyle(fontSize: 32, fontWeight: FontWeight.w500),
        ),
        backgroundColor: appNavbarColor,
        centerTitle: true,
      ),

      body: Center(
        child: Column(
          children: currentOrder.entries.map((entry) {
            return Text(
              'Item with ID ${entry.key}: ${entry.value} pcs',
              style: const TextStyle(color: Colors.white),
            );
          }).toList(),
        ),
      ),
    );
  }
}

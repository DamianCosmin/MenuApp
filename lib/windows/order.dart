import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:food_app/utils/order_provider.dart';
import 'package:food_app/utils/style.dart';
import 'package:food_app/widgets/order_item.dart';

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

      body: SingleChildScrollView(
        padding: EdgeInsets.symmetric(horizontal: 16, vertical: 32),
        physics: BouncingScrollPhysics(),
        child: Center(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: currentOrder.entries.map((entry) {
              return OrderItem(item: entry.key, qty: entry.value);
            }).toList(),
          ),
        ),
      ),
    );
  }
}

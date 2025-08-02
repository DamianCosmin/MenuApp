import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:food_app/utils/style.dart';
import 'package:food_app/utils/order_provider.dart';
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
    final orderTotal = context.watch<OrderProvider>().getOrderTotal();

    return Scaffold(
      extendBody: true,
      appBar: AppBar(
        title: Text(
          'YOUR ORDER',
          style: TextStyle(fontSize: 32, fontWeight: FontWeight.w500),
        ),
        backgroundColor: appNavbarColor,
        centerTitle: true,
        actions: [
          IconButton(
            padding: EdgeInsets.only(right: 8),
            onPressed: () {
              context.read<OrderProvider>().clearOrder();
            },
            icon: Icon(Icons.delete_forever_rounded),
            iconSize: 36,
            color: Colors.white,
            splashColor: Colors.transparent,
            highlightColor: Colors.transparent,
          ),
        ],
      ),

      body: SingleChildScrollView(
        // padding: EdgeInsets.symmetric(horizontal: 16, vertical: 32),
        padding: EdgeInsets.only(
          top: 32,
          bottom: itemNavbarHeight + MediaQuery.of(context).viewPadding.bottom,
          left: 16,
          right: 16,
        ),
        physics: BouncingScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            ...currentOrder.entries.map((entry) {
              return OrderItem(item: entry.key, qty: entry.value);
            }),

            if (orderTotal > 0)
              Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Text(
                    'Order total: ${orderTotal.toStringAsFixed(2)} RON',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 22,
                      fontWeight: FontWeight.w500,
                    ),
                    textAlign: TextAlign.left,
                  ),
                ],
              ),
          ],
        ),
      ),

      bottomNavigationBar: ClipRRect(
        borderRadius: BorderRadius.zero,
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 2.5, sigmaY: 2.5),
          child: Container(
            width: double.infinity,
            padding: EdgeInsets.only(
              bottom: MediaQuery.of(context).viewPadding.bottom + 8,
              top: 8,
            ),
            decoration: BoxDecoration(gradient: bottomNavbarGradient),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                ElevatedButton(
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(
                    padding: EdgeInsets.symmetric(
                      vertical: 16,
                      horizontal: MediaQuery.of(context).size.width * 0.2,
                    ),
                    backgroundColor: appNavbarColor,
                    textStyle: TextStyle(
                      fontWeight: FontWeight.w500,
                      fontSize: 28,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(50),
                    ),
                  ),
                  child: Text('Place Order'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

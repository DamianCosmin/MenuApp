import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:food_app/utils/counter_provider.dart';
import 'package:food_app/utils/order_provider.dart';
import 'package:food_app/utils/item_model.dart';
import 'package:food_app/utils/style.dart';

import 'package:food_app/widgets/counter_button.dart';

class ItemPage extends StatelessWidget {
  final ItemModel currentItem;
  final String dummyText =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat';

  const ItemPage({super.key, required this.currentItem});

  @override
  Widget build(BuildContext context) {
    final qty = context.watch<CounterProvider>().count;

    return Scaffold(
      extendBodyBehindAppBar: true,
      extendBody: true,
      appBar: AppBar(backgroundColor: Colors.transparent, elevation: 0),
      body: SingleChildScrollView(
        physics: BouncingScrollPhysics(),
        padding: EdgeInsets.only(
          bottom: itemNavbarHeight + MediaQuery.of(context).viewPadding.bottom,
        ),
        child: Column(
          children: [
            Hero(
              tag: currentItem.itemName,
              transitionOnUserGestures: true,
              child: Image(
                width: double.infinity,
                height: 300,
                image: AssetImage(currentItem.photoPath),
                fit: BoxFit.cover,
              ),
            ),

            SizedBox(height: 16),

            Padding(
              padding: EdgeInsets.symmetric(horizontal: 16),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  currentItem.itemName,
                  textAlign: TextAlign.left,
                  style: TextStyle(
                    fontSize: 34,
                    fontWeight: FontWeight.w500,
                    color: Colors.white,
                  ),
                  softWrap: true,
                ),
              ),
            ),

            Padding(
              padding: EdgeInsets.symmetric(horizontal: 16),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  '${currentItem.itemPrice} RON',
                  style: TextStyle(
                    fontSize: 26,
                    fontWeight: FontWeight.w500,
                    color: appPriceColor,
                  ),
                ),
              ),
            ),

            SizedBox(height: 8),

            Padding(
              padding: EdgeInsets.symmetric(horizontal: 16),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  '${currentItem.description}\n\n${dummyText * 5}',
                  textAlign: TextAlign.justify,
                  style: TextStyle(fontSize: 16, color: Colors.white),
                ),
              ),
            ),
          ],
        ),
      ),

      bottomNavigationBar: ClipRRect(
        borderRadius: BorderRadius.zero,
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 2.5, sigmaY: 2.5),
          child: Container(
            color: Colors.transparent,
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
                  CounterButton(),
                  SizedBox(width: 20),
                  ElevatedButton(
                    onPressed: () {
                      context.read<OrderProvider>().addToOrder(
                        currentItem,
                        qty,
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      padding: EdgeInsets.symmetric(
                        vertical: 20,
                        horizontal: 28,
                      ),
                      backgroundColor: appNavbarColor,
                      textStyle: TextStyle(
                        fontWeight: FontWeight.w500,
                        fontSize: 20,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(50),
                      ),
                    ),
                    child: Row(
                      children: [
                        Text('Add to order'),
                        SizedBox(width: 8),
                        Icon(Icons.shopping_cart_outlined, size: 28),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

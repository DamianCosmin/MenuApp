import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';
import 'package:provider/provider.dart';

import 'package:food_app/utils/style.dart';
import 'package:food_app/utils/order_provider.dart';
import 'package:food_app/utils/table_provider.dart';
import 'package:food_app/utils/socket_service.dart';
import 'package:food_app/widgets/order_item.dart';

class OrderPage extends StatefulWidget {
  const OrderPage({super.key});

  @override
  State<OrderPage> createState() => OrderPageState();
}

class OrderPageState extends State<OrderPage> with TickerProviderStateMixin {
  final socketService = SocketService();
  bool adminResponded = true;

  late final AnimationController acceptOrderController;
  late final AnimationController declineOrderController;
  bool showAcceptPopup = false;
  bool showDeclinePopup = false;

  @override
  void initState() {
    super.initState();
    socketService.initSocket();

    socketService.onAdminConfirmed((_) {
      setState(() {
        adminResponded = true;
        showAcceptPopup = true;
      });
      print('Admin approved');
    });

    socketService.onAdminDecline((_) {
      setState(() {
        adminResponded = true;
        showDeclinePopup = true;
      });
      print('Admin declined');
    });

    acceptOrderController = AnimationController(vsync: this);
    acceptOrderController.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        setState(() {
          showAcceptPopup = false;
          acceptOrderController.reset();
        });
      }
    });

    declineOrderController = AnimationController(vsync: this);
    declineOrderController.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        setState(() {
          showDeclinePopup = false;
          declineOrderController.reset();
        });
      }
    });
  }

  @override
  void dispose() {
    socketService.dispose();
    acceptOrderController.dispose();
    declineOrderController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final currentOrder = context.watch<OrderProvider>().currentOrder;
    final orderTotal = context.watch<OrderProvider>().getOrderTotal();
    final tableID = context.read<TableProvider>().tableID;

    return Stack(
      children: [
        Scaffold(
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
            padding: EdgeInsets.only(
              top: 32,
              bottom:
                  itemNavbarHeight + MediaQuery.of(context).viewPadding.bottom,
              left: 16,
              right: 16,
            ),
            physics: BouncingScrollPhysics(),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                ...currentOrder.entries.map((entry) {
                  return OrderItem(
                    item: entry.key,
                    qty: entry.value,
                    editable: true,
                  );
                }),

                if (currentOrder.isNotEmpty)
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
                      onPressed: () async {
                        final response = await context
                            .read<OrderProvider>()
                            .sendOrderToAdmin(
                              currentOrder,
                              tableID,
                              orderTotal,
                            );

                        if (response) {
                          setState(() {
                            adminResponded = false;
                          });
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        padding: EdgeInsets.symmetric(
                          vertical: 16,
                          horizontal: MediaQuery.of(context).size.width * 0.2,
                        ),
                        backgroundColor: appNavbarColor,
                        textStyle: TextStyle(
                          fontWeight: FontWeight.w500,
                          fontSize: 24,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(50),
                        ),
                      ),
                      child: Text('PLACE ORDER'),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),

        if (!adminResponded)
          Positioned.fill(
            child: Container(
              color: const Color.fromARGB(160, 0, 0, 0),
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Lottie.asset(
                      "assets/animations/waiting-sand.json",
                      repeat: true,
                      frameRate: FrameRate(60),
                      width: 250,
                      height: 250,
                    ),

                    Text(
                      'Waiting for order confirmation...',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.normal,
                        decoration: TextDecoration.none,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

        if (showAcceptPopup)
          Positioned.fill(
            child: Container(
              color: const Color.fromARGB(160, 0, 0, 0),
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Lottie.asset(
                      "assets/animations/accept.json",
                      controller: acceptOrderController,
                      repeat: false,
                      frameRate: FrameRate(60),
                      width: 250,
                      height: 250,
                      onLoaded: (composition) {
                        acceptOrderController
                          ..duration = composition.duration
                          ..forward();
                      },
                    ),

                    Text(
                      'Order confirmed!',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.normal,
                        decoration: TextDecoration.none,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

        if (showDeclinePopup)
          Positioned.fill(
            child: Container(
              color: const Color.fromARGB(160, 0, 0, 0),
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Lottie.asset(
                      "assets/animations/decline.json",
                      controller: declineOrderController,
                      repeat: false,
                      frameRate: FrameRate(60),
                      width: 250,
                      height: 250,
                      onLoaded: (composition) {
                        declineOrderController
                          ..duration = composition.duration
                          ..forward();
                      },
                    ),

                    Text(
                      'Order declined!',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.normal,
                        decoration: TextDecoration.none,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
      ],
    );
  }
}

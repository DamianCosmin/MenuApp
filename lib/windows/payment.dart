import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import 'package:food_app/utils/style.dart';
import 'package:food_app/utils/order_model.dart';
import 'package:food_app/utils/table_provider.dart';
import 'package:food_app/utils/payment_provider.dart';

class PaymentPage extends StatefulWidget {
  const PaymentPage({super.key});

  @override
  State<PaymentPage> createState() => PaymentPageState();
}

class PaymentPageState extends State<PaymentPage>
    with TickerProviderStateMixin {
  int selectedIndex = 0;
  int selectedTipsIndex = 0;
  double tipAmount = 0;

  final List<String> paymentNames = ['Cash', 'Card'];

  final List<String> paymentIconPaths = [
    'assets/icons/cash.png',
    'assets/icons/card.png',
  ];

  final List<String> tipsText = ['No tips', '10%', '15%', 'Other'];

  bool dialogOpen = false;
  bool showPaymentPopup = false;
  late final AnimationController paymentCompletedController;

  @override
  void initState() {
    super.initState();

    paymentCompletedController = AnimationController(vsync: this);
    paymentCompletedController.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        setState(() {
          showPaymentPopup = false;
          paymentCompletedController.reset();

          if (mounted) {
            Navigator.pop(context);
          }
        });
      }
    });
  }

  @override
  void dispose() {
    paymentCompletedController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;

    List<OrderModel> prevOrders = context.read<TableProvider>().fullOrders;
    final tableTotal = context.read<TableProvider>().getTableTotal();
    final tableID = context.read<TableProvider>().tableID;

    return GestureDetector(
      onTap: () => FocusScope.of(context).unfocus(),
      child: Stack(
        children: [
          Scaffold(
            extendBody: true,
            appBar: AppBar(
              title: Text(
                'PAYMENT',
                style: TextStyle(fontSize: 32, fontWeight: FontWeight.w500),
              ),
              backgroundColor: appNavbarColor,
              centerTitle: true,
              actions: [],
            ),

            body: RefreshIndicator(
              color: appNavbarColor,
              backgroundColor: appSecondaryColor,
              strokeWidth: 2,
              onRefresh: () async {
                context.read<TableProvider>().fetchPreviousOrder();
                setState(() {});
              },
              child: SingleChildScrollView(
                padding: EdgeInsets.only(
                  top: 32,
                  bottom:
                      itemNavbarHeight +
                      MediaQuery.of(context).viewPadding.bottom,
                  left: 16,
                  right: 16,
                ),
                physics: BouncingScrollPhysics(),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Choose the payment method:',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.w500,
                      ),
                      textAlign: TextAlign.left,
                    ),

                    SizedBox(height: 16),

                    GridView.count(
                      crossAxisCount: 2,
                      physics: NeverScrollableScrollPhysics(),
                      crossAxisSpacing: 16,
                      mainAxisSpacing: 16,
                      padding: EdgeInsets.only(bottom: 16),
                      shrinkWrap: true,
                      children: List.generate(
                        2,
                        (index) => ElevatedButton(
                          onPressed: () {
                            FocusManager.instance.primaryFocus?.unfocus();

                            setState(() {
                              selectedIndex = index;
                            });
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Color.alphaBlend(
                              index == selectedIndex
                                  ? Colors.white.withAlpha(48)
                                  : Colors.transparent,
                              appSecondaryColor,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadiusGeometry.circular(20),
                            ),
                          ),
                          child: SizedBox.expand(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.center,
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Image.asset(
                                  paymentIconPaths[index],
                                  color: Colors.white,
                                  width: 64,
                                  height: 64,
                                ),
                                SizedBox(height: 8),
                                Text(
                                  paymentNames[index],
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 18,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),

                    Text(
                      'Add any tips?',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.w500,
                      ),
                      textAlign: TextAlign.left,
                    ),

                    SizedBox(height: 16),

                    GridView.count(
                      crossAxisCount: 4,
                      physics: NeverScrollableScrollPhysics(),
                      crossAxisSpacing: 8,
                      mainAxisSpacing: 16,
                      childAspectRatio: 2.0,
                      padding: EdgeInsets.only(bottom: 16),
                      shrinkWrap: true,
                      children: List.generate(
                        4,
                        (index) => ElevatedButton(
                          onPressed: () {
                            FocusManager.instance.primaryFocus?.unfocus();

                            setState(() {
                              selectedTipsIndex = index;

                              if (selectedTipsIndex == 0) {
                                tipAmount = 0;
                              }
                              if (selectedTipsIndex == 1) {
                                tipAmount = 0.1 * tableTotal;
                              }
                              if (selectedTipsIndex == 2) {
                                tipAmount = 0.15 * tableTotal;
                              }
                            });
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Color.alphaBlend(
                              index == selectedTipsIndex
                                  ? Colors.white.withAlpha(48)
                                  : Colors.transparent,
                              appSecondaryColor,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadiusGeometry.circular(20),
                            ),
                            alignment: Alignment.center,
                          ),
                          child: Text(
                            tipsText[index],
                            style: TextStyle(fontSize: 14),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      ),
                    ),

                    if (selectedTipsIndex == 3)
                      TextField(
                        inputFormatters: [
                          FilteringTextInputFormatter.digitsOnly,
                        ],
                        keyboardType: TextInputType.number,
                        textInputAction: TextInputAction.done,
                        maxLength: 6,

                        onChanged: (value) {
                          setState(() {
                            tipAmount = double.tryParse(value) ?? 0;
                          });
                        },

                        style: TextStyle(color: Colors.white, fontSize: 18),
                        decoration: InputDecoration(
                          hintText: 'Custom amount (ex: 10 RON)',
                          hintStyle: TextStyle(
                            color: Colors.white.withAlpha(192),
                          ),

                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(
                              color: Colors.white.withAlpha(96),
                              width: 1.0,
                            ),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(
                              color: Colors.white.withAlpha(128),
                              width: 1.5,
                            ),
                          ),

                          filled: true,
                          fillColor: appSecondaryColor,
                        ),
                      ),

                    SizedBox(height: 16),

                    Text(
                      'Summary',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.w500,
                      ),
                      textAlign: TextAlign.left,
                    ),

                    SizedBox(height: 4),

                    Padding(
                      padding: EdgeInsets.only(left: 12),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Table total',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.w500,
                            ),
                            textAlign: TextAlign.left,
                          ),

                          Text(
                            '${tableTotal.toStringAsFixed(2)} RON',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.w500,
                            ),
                            textAlign: TextAlign.left,
                          ),
                        ],
                      ),
                    ),

                    Padding(
                      padding: EdgeInsets.only(left: 12),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Tip amount',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.w500,
                            ),
                            textAlign: TextAlign.left,
                          ),

                          Text(
                            '${tipAmount.toStringAsFixed(2)} RON',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.w500,
                            ),
                            textAlign: TextAlign.left,
                          ),
                        ],
                      ),
                    ),

                    Padding(
                      padding: EdgeInsets.only(left: 12),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Payment method',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.w500,
                            ),
                            textAlign: TextAlign.left,
                          ),

                          Text(
                            paymentNames[selectedIndex],
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.w500,
                            ),
                            textAlign: TextAlign.left,
                          ),
                        ],
                      ),
                    ),

                    Divider(color: Colors.grey, height: 16, thickness: 1),

                    Padding(
                      padding: EdgeInsets.only(left: 12),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Total',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.w500,
                            ),
                            textAlign: TextAlign.left,
                          ),

                          Text(
                            '${(tableTotal + tipAmount).toStringAsFixed(2)} RON',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.w500,
                            ),
                            textAlign: TextAlign.left,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
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
                          final tableProvider = context.read<TableProvider>();
                          final paymentProvider = context
                              .read<PaymentProvider>();

                          await tableProvider.fetchPreviousOrder();
                          prevOrders = tableProvider.fullOrders;

                          final response = await paymentProvider
                              .sendPaymentToAdmin(
                                prevOrders,
                                tableID,
                                tableTotal,
                                tipAmount,
                                paymentNames[selectedIndex],
                              );

                          if (!context.mounted) {
                            return;
                          }

                          if (response) {
                            setState(() {
                              showPaymentPopup = true;
                            });
                          } else {
                            if (!dialogOpen) {
                              showDialog(
                                context: context,
                                builder: (context) => AlertDialog(
                                  title: Text(
                                    'Payment failed',
                                    style: TextStyle(color: Colors.white),
                                  ),
                                  backgroundColor: appNavbarColor,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  content: Text(
                                    'Cannot process the payment at the moment. Please try again later!',
                                    textAlign: TextAlign.justify,
                                    style: TextStyle(color: Colors.white),
                                  ),
                                  actions: [
                                    TextButton(
                                      onPressed: () => {Navigator.pop(context)},
                                      child: Text(
                                        'Ok',
                                        style: TextStyle(color: appPriceColor),
                                      ),
                                    ),
                                  ],
                                ),
                              ).then((_) {
                                if (!context.mounted) return;

                                dialogOpen = false;
                                Navigator.pop(context);
                              });
                            }
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
                        child: Text('PAY'),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          if (showPaymentPopup)
            Positioned.fill(
              child: Container(
                color: const Color.fromARGB(160, 0, 0, 0),
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Lottie.asset(
                        "assets/animations/payment-completed.json",
                        controller: paymentCompletedController,
                        repeat: false,
                        frameRate: FrameRate(60),
                        width: 250,
                        height: 250,
                        onLoaded: (composition) {
                          paymentCompletedController
                            ..duration = composition.duration
                            ..forward();
                        },
                      ),

                      Text(
                        'Payment successful!',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 22,
                          fontWeight: FontWeight.normal,
                          decoration: TextDecoration.none,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

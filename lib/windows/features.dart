import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:food_app/utils/table_provider.dart';
import 'package:provider/provider.dart';

import 'package:food_app/utils/style.dart';
import 'package:food_app/utils/order_provider.dart';
import 'package:food_app/widgets/order_item.dart';
import 'package:food_app/main.dart';

class FeaturesPage extends StatefulWidget {
  const FeaturesPage({super.key});

  @override
  State<FeaturesPage> createState() => FeaturesPageState();
}

class FeaturesPageState extends State<FeaturesPage> with RouteAware {
  bool _isInit = true;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final route = ModalRoute.of(context);
    if (route is PageRoute) {
      routeObserver.subscribe(this, route);
    }

    if (_isInit) {
      context.read<TableProvider>().fetchPreviousOrder();
      _isInit = false;
    }
  }

  @override
  void dispose() {
    routeObserver.unsubscribe(this);
    super.dispose();
  }

  // Called when coming back to this page
  @override
  void didPopNext() {
    context.read<TableProvider>().fetchPreviousOrder();
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;

    final tableId = context.read<TableProvider>().tableID;
    final prevOrder = context.watch<TableProvider>().previousOrder;
    final tableTotal = context.read<TableProvider>().getTableTotal();

    final List<String> requestNames = [
      'Call the waiter',
      'Ash tray',
      'Cutlery',
      'Tissues',
      'Blanket',
    ];

    final List<String> requestsIconPaths = [
      'assets/icons/waiter.png',
      'assets/icons/ashtray.png',
      'assets/icons/cutlery.png',
      'assets/icons/tissues.png',
      'assets/icons/blanket.png',
    ];

    void handleOrderMore() {
      final currentRoute = ModalRoute.of(context);

      if (currentRoute != null && currentRoute.isFirst) {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => HomePage()),
        );
      } else if (currentRoute != null) {
        Navigator.pop(context);
      } else {
        print("Error in accessing HomePage from FeaturesPage!");
      }
    }

    return Scaffold(
      extendBody: true,
      appBar: AppBar(
        title: Text(
          'OVERVIEW',
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
                itemNavbarHeight + MediaQuery.of(context).viewPadding.bottom,
            left: 16,
            right: 16,
          ),
          physics: BouncingScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Previously ordered',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.w500,
                ),
                textAlign: TextAlign.left,
              ),

              Column(
                children: prevOrder.map((orderItem) {
                  return OrderItem(
                    item: orderItem.key,
                    qty: orderItem.value,
                    editable: false,
                  );
                }).toList(),
              ),

              Text(
                'Table total: ${tableTotal.toStringAsFixed(2)} RON',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.w500,
                ),
                textAlign: TextAlign.left,
              ),

              SizedBox(height: 16),

              Center(
                child: ElevatedButton(
                  onPressed: handleOrderMore,
                  style: ElevatedButton.styleFrom(
                    padding: EdgeInsets.symmetric(
                      vertical: 12,
                      horizontal: MediaQuery.of(context).size.width * 0.15,
                    ),
                    backgroundColor: appNavbarColor,
                    textStyle: TextStyle(
                      fontWeight: FontWeight.w500,
                      fontSize: 22,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(50),
                    ),
                  ),
                  child: Text('ORDER MORE'),
                ),
              ),

              SizedBox(height: 16),

              Text(
                'Popular requests',
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
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(
                      backgroundColor: appSecondaryColor,
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
                            requestsIconPaths[index],
                            color: Colors.white,
                            width: 64,
                            height: 64,
                          ),
                          SizedBox(height: 8),
                          Text(
                            requestNames[index],
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

              GridView.count(
                crossAxisCount: 3,
                physics: NeverScrollableScrollPhysics(),
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                padding: EdgeInsets.only(bottom: 16),
                shrinkWrap: true,
                children: List.generate(
                  3,
                  (index) => ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(
                      backgroundColor: appSecondaryColor,
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
                            requestsIconPaths[index + 2],
                            color: Colors.white,
                            width: 48,
                            height: 48,
                          ),
                          SizedBox(height: 8),
                          Text(
                            requestNames[index + 2],
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
                  onPressed: () {},
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
    );
  }
}

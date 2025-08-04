import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:food_app/utils/counter_provider.dart';
import 'package:food_app/utils/loaders.dart';
import 'package:food_app/utils/item_model.dart';
import 'package:food_app/utils/style.dart';

import 'package:food_app/windows/item.dart';
import 'package:food_app/windows/order.dart';

class DessertsPage extends StatefulWidget {
  const DessertsPage({super.key});

  @override
  DessertsPageState createState() => DessertsPageState();
}

class DessertsPageState extends State<DessertsPage> {
  late Future<List<ItemModel>> desserts;

  @override
  void initState() {
    super.initState();
    desserts = loadDesserts();
  }

  @override
  Widget build(BuildContext context) {
    void viewItem(ItemModel dessert) {
      final page = ItemPage(currentItem: dessert);

      context.read<CounterProvider>().resetCounter();
      Navigator.push(context, MaterialPageRoute(builder: (context) => page));
    }

    void viewCart() {
      final page = OrderPage();

      Navigator.push(context, MaterialPageRoute(builder: (context) => page));
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'DESSERTS',
          style: TextStyle(fontSize: 32, fontWeight: FontWeight.w500),
        ),
        backgroundColor: appNavbarColor,
        centerTitle: true,
        actions: [
          IconButton(
            padding: EdgeInsets.only(right: 8),
            onPressed: viewCart,
            icon: Icon(Icons.shopping_cart_outlined),
            iconSize: 32,
            color: Colors.white,
            splashColor: Colors.transparent,
            highlightColor: Colors.transparent,
          ),
        ],
      ),

      body: FutureBuilder<List<ItemModel>>(
        future: loadDesserts(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return Center(child: Text('No desserts found'));
          }

          final dessertList = snapshot.data!;

          return SingleChildScrollView(
            padding: EdgeInsets.all(32),
            physics: BouncingScrollPhysics(),
            child: Center(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: List.generate(dessertList.length, (dessertIndex) {
                  final dessert = dessertList[dessertIndex];
                  return InkWell(
                    onTap: () => viewItem(dessert),
                    splashFactory: NoSplash.splashFactory,
                    highlightColor: Colors.black45,
                    child: Stack(
                      children: [
                        Container(
                          margin: EdgeInsets.only(bottom: 24),
                          padding: EdgeInsets.all(15),
                          width: double.infinity,
                          height: 150,
                          decoration: BoxDecoration(
                            color: appSecondaryColor,
                            borderRadius: BorderRadius.circular(15),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.start,
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              ClipRRect(
                                borderRadius: BorderRadius.circular(7.5),
                                child: Hero(
                                  tag: dessert.itemName,
                                  transitionOnUserGestures: true,
                                  child: Image(
                                    width: 120,
                                    height: 120,
                                    image: AssetImage(dessert.photoPath),
                                    fit: BoxFit.cover,
                                  ),
                                ),
                              ),

                              SizedBox(width: 16),

                              Flexible(
                                child: Text(
                                  dessert.itemName,
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.w500,
                                    color: Colors.white,
                                  ),
                                  softWrap: true,
                                  overflow: TextOverflow.ellipsis,
                                  maxLines: 2,
                                ),
                              ),
                            ],
                          ),
                        ),

                        Positioned(
                          bottom: 24,
                          right: 0,
                          child: Container(
                            width: 120,
                            padding: EdgeInsets.symmetric(vertical: 5),
                            decoration: BoxDecoration(
                              color: appNavbarColor,
                              borderRadius: BorderRadius.only(
                                topLeft: Radius.circular(20),
                                bottomRight: Radius.circular(10),
                              ),
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              '${dessert.itemPrice} RON',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 18,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  );
                }),
              ),
            ),
          );
        },
      ),
    );
  }
}

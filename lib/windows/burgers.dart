import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:food_app/utils/counter_provider.dart';
import 'package:food_app/utils/load_burgers.dart';
import 'package:food_app/utils/style.dart';
import 'package:food_app/windows/item.dart';
import 'package:food_app/utils/item_model.dart';
import 'package:food_app/windows/order.dart';

class BurgersPage extends StatefulWidget {
  const BurgersPage({super.key});

  @override
  BurgersPageState createState() => BurgersPageState();
}

class BurgersPageState extends State<BurgersPage> {
  late Future<List<ItemModel>> burgers;

  @override
  void initState() {
    super.initState();
    burgers = loadBurgers();
  }

  final String dummyText =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat';

  @override
  Widget build(BuildContext context) {
    final List<String> burgersNames = [
      'Classic Burger',
      'Cheeseburger',
      'Double Cheeseburger',
      'Triple Cheeseburger',
      'Bacon Burger',
      'Spicy Burger',
      'Chicken Burger',
      'Vegan Burger',
    ];

    void viewItem(ItemModel burger) {
      final page = ItemPage(
        id: burger.itemID,
        name: burger.itemName,
        description: '${burger.description}\n\n${dummyText * 5}',
        price: burger.itemPrice,
        photoPath: burger.photoPath,
        heroTag: burger.itemName,
      );

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
          'BURGERS',
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
        future: loadBurgers(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return Center(child: Text('No burgers found'));
          }

          final burgers = snapshot.data!;

          return SingleChildScrollView(
            padding: EdgeInsets.all(32),
            physics: BouncingScrollPhysics(),
            child: Center(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: List.generate(burgers.length, (burgerIndex) {
                  final burger = burgers[burgerIndex];
                  return InkWell(
                    onTap: () => viewItem(burger),
                    splashFactory: NoSplash.splashFactory,
                    highlightColor: Colors.black45,
                    child: Container(
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
                              tag: burger.itemName,
                              transitionOnUserGestures: true,
                              child: Image(
                                width: 120,
                                height: 120,
                                image: AssetImage(burger.photoPath),
                                fit: BoxFit.cover,
                              ),
                            ),
                          ),

                          SizedBox(width: 16),

                          Flexible(
                            child: Text(
                              burger.itemName,
                              style: TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.w500,
                                color: Colors.white,
                              ),
                              softWrap: true,
                            ),
                          ),
                        ],
                      ),
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

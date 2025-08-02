import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:food_app/utils/counter_provider.dart';
import 'package:food_app/utils/loaders.dart';
import 'package:food_app/utils/item_model.dart';
import 'package:food_app/utils/style.dart';

import 'package:food_app/windows/item.dart';
import 'package:food_app/windows/order.dart';

class PizzaPage extends StatefulWidget {
  const PizzaPage({super.key});

  @override
  PizzaPageState createState() => PizzaPageState();
}

class PizzaPageState extends State<PizzaPage> {
  late Future<List<ItemModel>> pizzas;

  @override
  void initState() {
    super.initState();
    pizzas = loadPizza();
  }

  @override
  Widget build(BuildContext context) {
    void viewItem(ItemModel pizza) {
      final page = ItemPage(currentItem: pizza);

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
          'PIZZA',
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
        future: loadPizza(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return Center(child: Text('No pizzas found'));
          }

          final pizzaList = snapshot.data!;

          return SingleChildScrollView(
            padding: EdgeInsets.all(32),
            physics: BouncingScrollPhysics(),
            child: Center(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: List.generate(pizzaList.length, (pizzaIndex) {
                  final pizza = pizzaList[pizzaIndex];
                  return InkWell(
                    onTap: () => viewItem(pizza),
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
                              tag: pizza.itemName,
                              transitionOnUserGestures: true,
                              child: Image(
                                width: 120,
                                height: 120,
                                image: AssetImage(pizza.photoPath),
                                fit: BoxFit.cover,
                              ),
                            ),
                          ),

                          SizedBox(width: 16),

                          Flexible(
                            child: Text(
                              pizza.itemName,
                              style: TextStyle(
                                fontSize: 22,
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

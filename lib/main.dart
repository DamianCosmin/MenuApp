import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:food_app/windows/features.dart';
import 'package:provider/provider.dart';

import 'package:food_app/utils/style.dart';
import 'package:food_app/utils/order_provider.dart';
import 'package:food_app/utils/counter_provider.dart';
import 'package:food_app/utils/table_provider.dart';

import 'package:food_app/windows/burgers.dart';
import 'package:food_app/windows/pizza.dart';
import 'package:food_app/windows/pasta.dart';
import 'package:food_app/windows/coffee.dart';
import 'package:food_app/windows/drinks.dart';
import 'package:food_app/windows/wines.dart';
import 'package:food_app/windows/desserts.dart';
import 'package:food_app/windows/order.dart';
import 'package:food_app/windows/qr_page.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => TableProvider()),
        ChangeNotifierProvider(create: (_) => CounterProvider()),
        ChangeNotifierProvider(create: (_) => OrderProvider()),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);

    return MaterialApp(
      title: 'Food App',
      initialRoute: '/',
      theme: ThemeData(
        scaffoldBackgroundColor: appPrimaryColor,
        useMaterial3: false,
        fontFamily: 'Poppins',
      ),
      debugShowCheckedModeBanner: false,
      home: const QrPage(),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    final List<String> categoriesTitles = [
      'Burgers',
      'Pizza',
      'Pasta',
      'Coffee',
      'Soft Drinks',
      'Wines',
      'Desserts',
    ];

    final List<String> categoriesImages = [
      'burgers.png',
      'pizza.png',
      'pasta.png',
      'coffee.png',
      'soft_drinks2.png',
      'wines.png',
      'desserts.png',
    ];

    final Map<int, Widget> categoriesPages = {
      0: const BurgersPage(),
      1: const PizzaPage(),
      2: const PastaPage(),
      3: const CoffeePage(),
      4: const DrinksPage(),
      5: const WinesPage(),
      6: const DessertsPage(),
    };

    void viewCategory(int index) {
      final page = categoriesPages[index] ?? const NotFoundPage();

      Navigator.push(context, MaterialPageRoute(builder: (context) => page));
    }

    void viewCart() {
      final page = OrderPage();

      Navigator.push(context, MaterialPageRoute(builder: (context) => page));
    }

    final List<Widget> menuCategories = List.generate(
      7,
      (categoryIndex) => Container(
        margin: EdgeInsets.only(bottom: 24),
        child: InkWell(
          onTap: () => viewCategory(categoryIndex),
          splashFactory: NoSplash.splashFactory,
          highlightColor: Colors.black45,
          child: Ink(
            height: 150,
            width: double.infinity,
            decoration: BoxDecoration(
              image: DecorationImage(
                image: AssetImage(
                  'assets/images/${categoriesImages[categoryIndex]}',
                ),
                opacity: 0.5,
                fit: BoxFit.cover,
              ),
              borderRadius: BorderRadius.circular(15),
            ),
            child: Center(
              child: Text(
                categoriesTitles[categoryIndex],
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w500,
                  color: Colors.white,
                ),
              ),
            ),
          ),
        ),
      ),
    );

    return Scaffold(
      extendBody: true,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            backgroundColor: appNavbarColor,
            expandedHeight: 300,
            floating: false,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Opacity(
                opacity: 0.85,
                child: Image(
                  image: AssetImage('assets/images/restaurant2.png'),
                  fit: BoxFit.cover,
                ),
              ),
              title: Text(
                'MENU',
                style: TextStyle(fontSize: 40, fontWeight: FontWeight.w500),
                textAlign: TextAlign.center,
              ),
              titlePadding: EdgeInsets.symmetric(vertical: 4),
              centerTitle: true,
            ),
          ),

          SliverToBoxAdapter(
            child: Container(
              padding: EdgeInsets.all(32),
              child: Center(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: menuCategories,
                ),
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewPadding.bottom + 8,
          right: MediaQuery.of(context).viewPadding.right + 24,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            Material(
              color: appNavbarColor,
              shape: CircleBorder(),
              child: SizedBox(
                width: 80,
                height: 80,
                child: IconButton(
                  onPressed: viewCart,
                  icon: Icon(Icons.shopping_cart_outlined),
                  iconSize: 44,
                  color: Colors.white,
                  splashColor: Colors.transparent,
                  highlightColor: Colors.transparent,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class NotFoundPage extends StatelessWidget {
  const NotFoundPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(body: Text('ERROR'));
  }
}

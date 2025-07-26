import 'package:flutter/material.dart';
import 'package:food_app/utils/style.dart';

class WinesPage extends StatelessWidget {
  const WinesPage({super.key});

  @override
  Widget build(BuildContext context) {
    final List<String> burgersNames = ['Red Wine', 'Rose Wine', 'White Wine'];

    final List<Widget> burgersList = List.generate(
      3,
      (burgerIndex) => Container(
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
              child: Image(
                width: 120,
                height: 120,
                image: AssetImage('assets/images/wines/template.png'),
                fit: BoxFit.cover,
              ),
            ),

            SizedBox(width: 16),

            Flexible(
              child: Text(
                burgersNames[burgerIndex],
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

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'WINES',
          style: TextStyle(fontSize: 32, fontWeight: FontWeight.w500),
        ),
        backgroundColor: appNavbarColor,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(32),
        physics: BouncingScrollPhysics(),
        child: Center(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: burgersList,
          ),
        ),
      ),
    );
  }
}

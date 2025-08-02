import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:food_app/utils/counter_provider.dart';
import 'package:food_app/utils/style.dart';

class CounterButton extends StatefulWidget {
  const CounterButton({super.key});

  @override
  CounterButtonState createState() => CounterButtonState();
}

class CounterButtonState extends State<CounterButton> {
  @override
  Widget build(BuildContext context) {
    final count = context.watch<CounterProvider>().count;

    return Container(
      decoration: BoxDecoration(
        color: appCounterButtonColor,
        borderRadius: BorderRadius.circular(50),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          IconButton(
            icon: Icon(Icons.remove, color: Colors.white),
            onPressed: () {
              context.read<CounterProvider>().decrement();
            },
            splashColor: Colors.transparent,
            highlightColor: Colors.transparent,
          ),

          Container(
            width: 46,
            padding: EdgeInsets.symmetric(horizontal: 10),
            child: Text(
              '$count',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 20,
                color: Colors.white,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),

          IconButton(
            icon: Icon(Icons.add, color: Colors.white),
            onPressed: () {
              context.read<CounterProvider>().increment();
            },
            splashColor: Colors.transparent,
            highlightColor: Colors.transparent,
          ),
        ],
      ),
    );
  }
}

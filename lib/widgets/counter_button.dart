import 'package:flutter/material.dart';
import 'package:food_app/utils/counter_provider.dart';
import 'package:food_app/utils/style.dart';
import 'package:provider/provider.dart';

class CounterButton extends StatefulWidget {
  final int initialValue;
  final int min;
  final int max;

  const CounterButton({
    // default values
    super.key,
    this.initialValue = 1,
    this.min = 1,
    this.max = 99,
  });

  @override
  CounterButtonState createState() => CounterButtonState();
}

class CounterButtonState extends State<CounterButton> {
  // late int count;

  // @override
  // void initState() {
  //   super.initState();
  //   count = widget.initialValue;
  // }

  // void _increment() {
  //   if (count < widget.max) {
  //     setState(() {
  //       count++;
  //     });
  //   }
  // }

  // void _decrement() {
  //   if (count > widget.min) {
  //     setState(() {
  //       count--;
  //     });
  //   }
  // }

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

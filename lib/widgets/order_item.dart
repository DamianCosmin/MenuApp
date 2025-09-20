import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:food_app/utils/style.dart';
import 'package:food_app/utils/item_model.dart';
import 'package:food_app/utils/order_provider.dart';

class OrderItem extends StatefulWidget {
  final ItemModel item;
  final int qty;
  const OrderItem({super.key, required this.item, required this.qty});

  @override
  OrderItemState createState() => OrderItemState();
}

class OrderItemState extends State<OrderItem> {
  bool isVisible = false;
  double currentHeight = 100;

  final double defaultHeight = 100;
  final double expandedHeight = 160;

  @override
  void initState() {
    super.initState();
    isVisible = false;
    currentHeight = defaultHeight;
  }

  void toggleEditMode() {
    setState(() {
      isVisible = !isVisible;
      currentHeight = (currentHeight == defaultHeight)
          ? expandedHeight
          : defaultHeight;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(bottom: 16),
      padding: EdgeInsets.all(10),
      width: double.infinity,
      height: currentHeight,
      decoration: BoxDecoration(
        color: appSecondaryColor,
        borderRadius: BorderRadius.circular(15),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(7.5),
                child: Image(
                  width: 80,
                  height: 80,
                  image: AssetImage(widget.item.photoPath),
                  fit: BoxFit.cover,
                ),
              ),

              SizedBox(width: 16),

              Expanded(
                flex: 2,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      '${widget.qty > 1 ? '${widget.qty}x ' : ''}${widget.item.itemName}',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w500,
                        color: Colors.white,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),

                    Text(
                      '${(widget.item.itemPrice * widget.qty).toStringAsFixed(2)} RON',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w500,
                        color: appPriceColor,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),

              Flexible(
                child: Align(
                  alignment: Alignment.centerRight,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      GestureDetector(
                        onTap: toggleEditMode,
                        child: Icon(Icons.edit, size: 28, color: Colors.white),
                      ),

                      SizedBox(width: 10),

                      GestureDetector(
                        onTap: () {
                          context.read<OrderProvider>().removeItem(widget.item);
                        },
                        child: Icon(
                          Icons.delete_outline,
                          size: 28,
                          color: Colors.red,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),

          if (isVisible)
            Container(
              padding: EdgeInsets.only(top: 10),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  IconButton(
                    onPressed: () {
                      context.read<OrderProvider>().removeFromOrder(
                        widget.item,
                      );
                    },
                    icon: Icon(Icons.remove, size: 30, color: Colors.white),
                    highlightColor: Colors.transparent,
                    splashColor: Colors.transparent,
                  ),

                  Container(
                    width: 60,
                    padding: EdgeInsets.symmetric(horizontal: 0),
                    child: Text(
                      '${widget.qty}',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 30,
                        color: Colors.white,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),

                  IconButton(
                    onPressed: () {
                      context.read<OrderProvider>().addToOrder(widget.item, 1);
                    },
                    icon: Icon(Icons.add, size: 30, color: Colors.white),
                    highlightColor: Colors.transparent,
                    splashColor: Colors.transparent,
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}

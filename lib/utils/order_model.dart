import 'package:food_app/utils/item_model.dart';

class OrderModel {
  final int orderID;
  final String orderStatus;
  final int tableID;
  final List<MapEntry<ItemModel, int>> orderItems;
  final double total;

  OrderModel({
    required this.orderID,
    required this.orderStatus,
    required this.tableID,
    required this.orderItems,
    required this.total,
  });

  factory OrderModel.fromJson(Map<String, dynamic> json) {
    return OrderModel(
      orderID: json['id'] as int,
      orderStatus: json['status'] as String,
      tableID: json['tableID'] as int,
      orderItems: (json['items'] as List).map<MapEntry<ItemModel, int>>((
        entry,
      ) {
        ItemModel item = ItemModel.fromJson(entry['item']);
        int qty = entry['quantity'] as int;
        return MapEntry(item, qty);
      }).toList(),
      total: (json['total'] as num).toDouble(),
    );
  }
}

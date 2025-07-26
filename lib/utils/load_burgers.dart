import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import 'package:food_app/utils/item_model.dart';

Future<List<ItemModel>> loadBurgers() async {
  final String response = await rootBundle.loadString(
    'assets/data/burgers.json',
  );
  final List<dynamic> data = json.decode(response);
  return data.map((json) => ItemModel.fromJson(json)).toList();
}

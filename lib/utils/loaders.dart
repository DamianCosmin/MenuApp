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

Future<List<ItemModel>> loadPizza() async {
  final String response = await rootBundle.loadString('assets/data/pizza.json');
  final List<dynamic> data = json.decode(response);
  return data.map((json) => ItemModel.fromJson(json)).toList();
}

Future<List<ItemModel>> loadPasta() async {
  final String response = await rootBundle.loadString('assets/data/pasta.json');
  final List<dynamic> data = json.decode(response);
  return data.map((json) => ItemModel.fromJson(json)).toList();
}

Future<List<ItemModel>> loadCoffee() async {
  final String response = await rootBundle.loadString(
    'assets/data/coffee.json',
  );
  final List<dynamic> data = json.decode(response);
  return data.map((json) => ItemModel.fromJson(json)).toList();
}

Future<List<ItemModel>> loadDrinks() async {
  final String response = await rootBundle.loadString(
    'assets/data/drinks.json',
  );
  final List<dynamic> data = json.decode(response);
  return data.map((json) => ItemModel.fromJson(json)).toList();
}

Future<List<ItemModel>> loadWines() async {
  final String response = await rootBundle.loadString('assets/data/wines.json');
  final List<dynamic> data = json.decode(response);
  return data.map((json) => ItemModel.fromJson(json)).toList();
}

Future<List<ItemModel>> loadDesserts() async {
  final String response = await rootBundle.loadString(
    'assets/data/desserts.json',
  );
  final List<dynamic> data = json.decode(response);
  return data.map((json) => ItemModel.fromJson(json)).toList();
}

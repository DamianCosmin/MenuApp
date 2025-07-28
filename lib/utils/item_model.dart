class ItemModel {
  final int categoryID;
  final int itemID;
  final String itemName;
  final double itemPrice;
  final String description;
  final String photoPath;

  ItemModel({
    required this.categoryID,
    required this.itemID,
    required this.itemName,
    required this.itemPrice,
    required this.description,
    required this.photoPath,
  });

  factory ItemModel.fromJson(Map<String, dynamic> json) {
    return ItemModel(
      categoryID: json['categoryID'],
      itemID: json['itemID'],
      itemName: json['itemName'],
      itemPrice: (json['itemPrice'] as num).toDouble(),
      description: json['description'],
      photoPath: json['photoPath'],
    );
  }

  @override
  bool operator ==(Object other) =>
      other is ItemModel &&
      other.categoryID == categoryID &&
      other.itemID == itemID;

  @override
  int get hashCode => categoryID.hashCode ^ itemID.hashCode;
}

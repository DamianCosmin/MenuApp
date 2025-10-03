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
      categoryID: json['categoryID'] as int,
      itemID: json['itemID'] as int,
      itemName: json['itemName'] as String,
      itemPrice: (json['itemPrice'] as num).toDouble(),
      description: json['description'] as String,
      photoPath: json['photoPath'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "categoryID": categoryID,
      "itemID": itemID,
      "itemName": itemName,
      "itemPrice": itemPrice,
      "description": description,
      "photoPath": photoPath,
    };
  }

  @override
  bool operator ==(Object other) =>
      other is ItemModel &&
      other.categoryID == categoryID &&
      other.itemID == itemID;

  @override
  int get hashCode => categoryID.hashCode ^ itemID.hashCode;
}

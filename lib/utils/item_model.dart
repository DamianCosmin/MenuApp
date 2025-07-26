class ItemModel {
  // should add categoryID as well
  final int itemID;
  final String itemName;
  final double itemPrice;
  final String description;
  final String photoPath;

  ItemModel({
    required this.itemID,
    required this.itemName,
    required this.itemPrice,
    required this.description,
    required this.photoPath,
  });

  factory ItemModel.fromJson(Map<String, dynamic> json) {
    return ItemModel(
      itemID: json['itemID'],
      itemName: json['itemName'],
      itemPrice: (json['itemPrice'] as num).toDouble(),
      description: json['description'],
      photoPath: json['photoPath'],
    );
  }
}

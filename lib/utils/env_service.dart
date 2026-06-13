import 'package:flutter_dotenv/flutter_dotenv.dart';

class EnvService {
  static String get flutterSecret => dotenv.env["FLUTTER_KEY"] ?? "";
}

import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:food_app/utils/routes.dart';

class SocketService {
  late IO.Socket socket;

  void initSocket() {
    socket = IO.io(
      BASE_ROUTE,
      IO.OptionBuilder()
          .setTransports(['websocket'])
          .disableAutoConnect()
          .build(),
    );

    socket.connect();

    socket.onConnect((_) => print('Connected to order page socket!'));
    socket.onDisconnect((_) => print('Disconnected from order page socket!'));
  }

  void onAdminConfirmed(Function(dynamic) callback) {
    socket.on('adminConfirmed', callback);
  }

  void onAdminDecline(Function(dynamic) callback) {
    socket.on('adminDeclined', callback);
  }

  void joinOrderRoom(int orderId) {
    socket.emit('joinOrderRoom', orderId);
    print('🛎️ Joined room for order $orderId');
  }

  void dispose() {
    socket.dispose();
  }
}

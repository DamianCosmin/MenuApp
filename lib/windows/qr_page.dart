import 'dart:ffi';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';

import 'package:food_app/main.dart';
import 'package:food_app/utils/style.dart';

class QrPage extends StatefulWidget {
  const QrPage({super.key});

  @override
  QrPageState createState() => QrPageState();
}

class QrPageState extends State<QrPage> {
  final MobileScannerController mobileController = MobileScannerController(
    detectionSpeed: DetectionSpeed.noDuplicates,
    returnImage: true,
  );
  bool hasScanned = false;
  bool dialogOpen = false;
  final tablesUrl = "http://192.168.1.140:5050/tables/";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'SCAN QR CODE',
          style: TextStyle(fontSize: 32, fontWeight: FontWeight.w500),
        ),
        backgroundColor: appNavbarColor,
        centerTitle: true,
      ),

      body: MobileScanner(
        controller: mobileController,
        onDetect: (capture) {
          final List<Barcode> qrCodes = capture.barcodes;
          final Uint8List? image = capture.image;

          for (final qrCode in qrCodes) {
            final qrUrl = qrCode.rawValue;
            if (qrUrl != null && !hasScanned) {
              hasScanned = true;
              mobileController.stop();

              print('QR Code Address: $qrUrl');

              Uri uriScanned = Uri.parse(qrUrl);
              Uri uriValid = Uri.parse(tablesUrl);

              bool sameBaseUrl =
                  uriScanned.host == uriValid.host &&
                  uriScanned.port == uriValid.port;

              if (sameBaseUrl) {
                int tableId = int.parse(uriScanned.pathSegments[1]);
                print('From QR Page Table: $tableId');

                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(
                    builder: (context) => HomePage(tableID: tableId),
                  ),
                );

                break;
              } else {
                if (!dialogOpen) {
                  dialogOpen = true;
                  showDialog(
                    context: context,
                    builder: (context) => AlertDialog(
                      title: Text(
                        'Table not found',
                        style: TextStyle(color: Colors.white),
                      ),
                      backgroundColor: appNavbarColor,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                      content: Text(
                        'You might have scanned a wrong link. Please scan the QR code on your table!',
                        textAlign: TextAlign.justify,
                        style: TextStyle(color: Colors.white),
                      ),
                      actions: [
                        TextButton(
                          onPressed: () => {Navigator.pop(context)},
                          child: Text(
                            'Try again',
                            style: TextStyle(color: appPriceColor),
                          ),
                        ),
                      ],
                    ),
                  ).then(
                    (_) => {
                      dialogOpen = false,
                      hasScanned = false,
                      mobileController.start(),
                    },
                  );
                }

                // Future.delayed(const Duration(seconds: 2), () {
                //   hasScanned = false;
                //   mobileController.start();
                // });
              }
            }
          }
        },
      ),
    );
  }
}

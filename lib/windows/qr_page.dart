import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:mobile_scanner/mobile_scanner.dart';

import 'package:food_app/main.dart';
import 'package:food_app/windows/features.dart';
import 'package:food_app/utils/style.dart';
import 'package:food_app/utils/routes.dart';
import 'package:food_app/utils/table_provider.dart';

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
  final tablesUrl = "${API_ROUTE}tables/";

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
        onDetect: (capture) async {
          final List<Barcode> qrCodes = capture.barcodes;
          final Uint8List? image = capture.image;

          for (final qrCode in qrCodes) {
            final qrUrl = qrCode.rawValue;
            if (qrUrl != null && !hasScanned) {
              hasScanned = true;
              mobileController.stop();

              print('QR Code Address: $qrUrl');
              print('Tables Url: $tablesUrl');

              Uri uriScanned = Uri.parse(qrUrl);
              Uri uriValid = Uri.parse(tablesUrl);

              bool sameBaseUrl =
                  uriScanned.host == uriValid.host &&
                  uriScanned.port == uriValid.port;

              if (sameBaseUrl) {
                int tableId = int.parse(uriScanned.pathSegments[2]);
                print('From QR Page Table: $tableId');

                final result = await context.read<TableProvider>().setTableID(
                  tableId,
                );

                if (!context.mounted) return;

                if (result == true) {
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(builder: (context) => FeaturesPage()),
                  );
                } else if (result == false) {
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(builder: (context) => HomePage()),
                  );
                } else {
                  // TO-DO: may add a function here for these dialogs or check
                  // the connection with the server on another page
                  if (!dialogOpen) {
                    dialogOpen = true;
                    if (!context.mounted) return;
                    showDialog(
                      context: context,
                      builder: (context) => AlertDialog(
                        title: Text(
                          'Server not responding',
                          style: TextStyle(color: Colors.white),
                        ),
                        backgroundColor: appNavbarColor,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                        ),
                        content: Text(
                          'Cannot establish a proper connection with the server. Please try again later!',
                          textAlign: TextAlign.justify,
                          style: TextStyle(color: Colors.white),
                        ),
                        actions: [
                          TextButton(
                            onPressed: () => {Navigator.pop(context)},
                            child: Text(
                              'Ok',
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
                }
              } else {
                if (!dialogOpen) {
                  dialogOpen = true;
                  if (!context.mounted) return;
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

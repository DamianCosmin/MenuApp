import 'package:flutter/material.dart';

const Color appPrimaryColor = Color(0xFF121212);
const Color appSecondaryColor = Color(0x9B333333);
const Color appNavbarColor = Color(0xFFB2560D);
const Color appPriceColor = Color(0xFFFFC107);
const Color appCounterButtonColor = Color(0xFF616161);

const double itemNavbarHeight = 100.0;

const LinearGradient bottomNavbarGradient = LinearGradient(
  colors: [
    Color.fromRGBO(18, 18, 18, 0),
    Color.fromRGBO(18, 18, 18, 0.25),
    Color.fromRGBO(18, 18, 18, 0.5),
    Color.fromRGBO(18, 18, 18, 0.75),
    Color.fromRGBO(18, 18, 18, 1),
  ],
  begin: Alignment.topCenter,
  end: Alignment.bottomCenter,
);

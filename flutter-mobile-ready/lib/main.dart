
import 'package:flutter/material.dart';

void main() => runApp(const FreshCatchV2App());

class FreshCatchV2App extends StatelessWidget {
  const FreshCatchV2App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FreshCatch NG',
      debugShowCheckedModeBanner: false,
      home: DefaultTabController(
        length: 2,
        child: Scaffold(
          appBar: AppBar(title: const Text('FreshCatch NG Mobile'), bottom: const TabBar(tabs: [
            Tab(text: 'Customer'),
            Tab(text: 'Rider')
          ])),
          body: const TabBarView(children: [
            Center(child: Text('Customer app starter: products, cart, checkout, tracking')),
            Center(child: Text('Rider app starter: assigned orders, GPS, delivery updates'))
          ]),
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:essentials_mart_customer/features/walk_mode/data/walk_mode_models.dart';
import 'package:essentials_mart_customer/features/walk_mode/presentation/walk_mode_spatial_controls.dart';

void main() {
  testWidgets('directional controls emit movement intent', (tester) async {
    WalkModeSpatialPosition? movedTo;

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: WalkModeSpatialControls(
            position: const WalkModeSpatialPosition(x: 1, y: 2, z: 3),
            onMove: (position) => movedTo = position,
          ),
        ),
      ),
    );

    await tester.tap(find.byTooltip('Move forward'));
    expect(movedTo?.x, 1);
    expect(movedTo?.y, 3);
    expect(movedTo?.z, 3);

    await tester.tap(find.byTooltip('Move left'));
    expect(movedTo?.x, 0);
    expect(movedTo?.y, 2);
    expect(movedTo?.z, 3);

    await tester.tap(find.byTooltip('Move backward'));
    expect(movedTo?.x, 1);
    expect(movedTo?.y, 1);
    expect(movedTo?.z, 3);

    await tester.tap(find.byTooltip('Move right'));
    expect(movedTo?.x, 2);
    expect(movedTo?.y, 2);
    expect(movedTo?.z, 3);
  });
}

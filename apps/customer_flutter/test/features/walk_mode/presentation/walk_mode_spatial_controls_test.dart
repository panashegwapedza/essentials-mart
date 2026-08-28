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
    expect(movedTo, const WalkModeSpatialPosition(x: 1, y: 3, z: 3));

    await tester.tap(find.byTooltip('Move left'));
    expect(movedTo, const WalkModeSpatialPosition(x: 0, y: 2, z: 3));

    await tester.tap(find.byTooltip('Move backward'));
    expect(movedTo, const WalkModeSpatialPosition(x: 1, y: 1, z: 3));

    await tester.tap(find.byTooltip('Move right'));
    expect(movedTo, const WalkModeSpatialPosition(x: 2, y: 2, z: 3));
  });
}

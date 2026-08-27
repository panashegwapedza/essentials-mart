/// Fidelity level of a Walk Mode product representation.
enum WalkModeAssetFidelity {
  high,
  reduced,
  imageFallback,
  unavailable,
}

/// Renderer-neutral identity and presentation contract for a product asset.
///
/// Product identity remains authoritative; this object only describes how the
/// product can be represented visually in Walk Mode.
class WalkModeProductAsset {
  const WalkModeProductAsset({
    required this.assetId,
    required this.productId,
    required this.version,
    required this.fidelity,
    this.model3dUri,
    this.arAssetUri,
  });

  final String assetId;
  final String productId;
  final String version;
  final WalkModeAssetFidelity fidelity;
  final String? model3dUri;
  final String? arAssetUri;

  bool get has3d => model3dUri != null && model3dUri!.isNotEmpty;
  bool get hasAr => arAssetUri != null && arAssetUri!.isNotEmpty;
}

/// Validates that a product asset can be trusted as a representation of the
/// authoritative product identity.
class WalkModeProductAssetValidator {
  const WalkModeProductAssetValidator();

  String? validate(WalkModeProductAsset asset) {
    if (asset.assetId.isEmpty) return 'Asset identity is missing.';
    if (asset.productId.isEmpty) return 'Product identity is missing.';
    if (asset.version.isEmpty) return 'Asset version is missing.';

    switch (asset.fidelity) {
      case WalkModeAssetFidelity.high:
      case WalkModeAssetFidelity.reduced:
        if (!asset.has3d) return '3D asset is required for this fidelity level.';
        break;
      case WalkModeAssetFidelity.imageFallback:
      case WalkModeAssetFidelity.unavailable:
        break;
    }

    return null;
  }
}

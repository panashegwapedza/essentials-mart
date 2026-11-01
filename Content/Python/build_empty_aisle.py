"""Build the Essentials Mart empty master aisle in Unreal Editor.

Run from the Unreal Editor Python console:
    py "Content/Python/build_empty_aisle.py"

This creates a fresh level at /Game/Maps/EM_EmptyAisle. All dimensions are centimetres.
The aisle is intentionally product-free: no SKUs, packaging, price strips or promotions.
"""
import unreal

PROJECT_ROOT = "/Game"
MAP_PATH = "/Game/Maps/EM_EmptyAisle"
MATERIAL_PATH = "/Game/Materials/WalkMode"
PREFIX = "EM_AISLE_"

# Real-world scale (cm)
AISLE_LENGTH = 2600.0
AISLE_WIDTH = 920.0
CEILING_HEIGHT = 500.0
SHELF_BAY_WIDTH = 380.0
BAY_COUNT = 6

assets = unreal.AssetToolsHelpers.get_asset_tools()
cube = unreal.EditorAssetLibrary.load_asset("/Engine/BasicShapes/Cube.Cube")
if not cube:
    raise RuntimeError("Could not load Unreal's Engine BasicShapes/Cube asset.")

def make_material(name, rgb, roughness=0.65, metallic=0.0, opacity=None):
    """Create a small reusable PBR material in /Game/Materials/WalkMode."""
    unreal.EditorAssetLibrary.make_directory(MATERIAL_PATH)
    path = MATERIAL_PATH + "/" + name
    existing = unreal.EditorAssetLibrary.load_asset(path)
    if existing:
        return existing
    material = assets.create_asset(name, MATERIAL_PATH, unreal.Material, unreal.MaterialFactoryNew())
    if not material:
        raise RuntimeError("Could not create material: " + name)
    base = unreal.MaterialEditingLibrary.create_material_expression(
        material, unreal.MaterialExpressionConstant3Vector, -400, 0
    )
    base.set_editor_property("constant", unreal.LinearColor(rgb[0], rgb[1], rgb[2], 1.0))
    unreal.MaterialEditingLibrary.connect_material_property(
        base, "RGB", unreal.MaterialProperty.MP_BASE_COLOR
    )
    rough = unreal.MaterialEditingLibrary.create_material_expression(
        material, unreal.MaterialExpressionConstant, -400, 180
    )
    rough.set_editor_property("r", roughness)
    unreal.MaterialEditingLibrary.connect_material_property(
        rough, "", unreal.MaterialProperty.MP_ROUGHNESS
    )
    if metallic:
        metal = unreal.MaterialEditingLibrary.create_material_expression(
            material, unreal.MaterialExpressionConstant, -400, 300
        )
        metal.set_editor_property("r", metallic)
        unreal.MaterialEditingLibrary.connect_material_property(
            metal, "", unreal.MaterialProperty.MP_METALLIC
        )
    if opacity is not None:
        material.set_editor_property("blend_mode", unreal.BlendMode.BLEND_TRANSLUCENT)
        alpha = unreal.MaterialEditingLibrary.create_material_expression(
            material, unreal.MaterialExpressionConstant, -400, 440
        )
        alpha.set_editor_property("r", opacity)
        unreal.MaterialEditingLibrary.connect_material_property(
            alpha, "", unreal.MaterialProperty.MP_OPACITY
        )
        material.set_editor_property("two_sided", True)
    unreal.MaterialEditingLibrary.recompile_material(material)
    unreal.EditorAssetLibrary.save_loaded_asset(material)
    return material

MATS = {
    "floor": make_material("M_Floor_PolishedStone", (0.34, 0.37, 0.34), 0.24),
    "wall": make_material("M_WarmNeutral_Walls", (0.55, 0.53, 0.46), 0.82),
    "metal": make_material("M_Shelf_PowderCoat", (0.19, 0.23, 0.21), 0.38, 0.62),
    "shelf": make_material("M_Shelf_Surface", (0.38, 0.40, 0.37), 0.48, 0.28),
    "green": make_material("M_Essentials_Green", (0.035, 0.19, 0.095), 0.42),
    "wood": make_material("M_Warm_Wood", (0.34, 0.19, 0.095), 0.58),
    "glass": make_material("M_Refrigerator_Glass", (0.55, 0.78, 0.82), 0.12, 0.0, 0.16),
    "interior": make_material("M_Refrigerator_Interior", (0.12, 0.16, 0.16), 0.32),
    "light": make_material("M_LED_Diffuser", (0.92, 0.96, 1.0), 0.18),
}

def apply_material(actor, material):
    component = actor.get_component_by_class(unreal.StaticMeshComponent)
    if component:
        component.set_material(0, material)

def box(name, location, size, material, rotation=None):
    actor = unreal.EditorLevelLibrary.spawn_actor_from_class(
        unreal.StaticMeshActor,
        unreal.Vector(location[0], location[1], location[2]),
        rotation or unreal.Rotator(0.0, 0.0, 0.0),
    )
    if not actor:
        raise RuntimeError("Could not spawn actor: " + name)
    actor.set_actor_label(PREFIX + name)
    component = actor.get_component_by_class(unreal.StaticMeshComponent)
    component.set_static_mesh(cube)
    actor.set_actor_scale3d(unreal.Vector(size[0] / 100.0, size[1] / 100.0, size[2] / 100.0))
    apply_material(actor, material)
    return actor

def point_light(name, location, intensity=5200.0, radius=900.0, color=None):
    actor = unreal.EditorLevelLibrary.spawn_actor_from_class(
        unreal.PointLight, unreal.Vector(*location), unreal.Rotator(0.0, 0.0, 0.0)
    )
    actor.set_actor_label(PREFIX + name)
    light = actor.get_component_by_class(unreal.PointLightComponent)
    light.set_editor_property("intensity", intensity)
    light.set_editor_property("attenuation_radius", radius)
    if color:
        light.set_editor_property("light_color", unreal.Color(color[0], color[1], color[2], 255))
    return actor

def build_right_shelving():
    # Six empty, repeatable metal bays. The front faces the central walking lane.
    for bay in range(BAY_COUNT):
        x = 220.0 + bay * 410.0
        bay_name = "Right_Shelf_Bay_%02d" % (bay + 1)
        box(bay_name + "_Back", (x, 385, 205), (SHELF_BAY_WIDTH, 8, 220), MATS["metal"])
        for edge in (-SHELF_BAY_WIDTH / 2 + 8, SHELF_BAY_WIDTH / 2 - 8):
            box(bay_name + "_Upright", (x + edge, 350, 205), (10, 72, 235), MATS["metal"])
        for level, z in enumerate((48, 94, 140, 186, 228), start=1):
            box(bay_name + "_Empty_Shelf_%02d" % level, (x, 345, z), (SHELF_BAY_WIDTH - 14, 76, 5), MATS["shelf"])
        # Solid toe-kick keeps the shelf line visually continuous.
        box(bay_name + "_ToeKick", (x, 350, 13), (SHELF_BAY_WIDTH - 8, 70, 22), MATS["metal"])

def build_left_refrigeration():
    # Four empty, glass-fronted refrigerated cabinets, followed by two open shelf bays.
    for bay in range(4):
        x = 250.0 + bay * 410.0
        name = "Left_Empty_Fridge_%02d" % (bay + 1)
        box(name + "_Back", (x, -385, 205), (SHELF_BAY_WIDTH, 12, 230), MATS["interior"])
        box(name + "_Top", (x, -345, 325), (SHELF_BAY_WIDTH, 90, 12), MATS["metal"])
        box(name + "_Base", (x, -345, 82), (SHELF_BAY_WIDTH, 90, 16), MATS["metal"])
        for edge in (-SHELF_BAY_WIDTH / 2 + 7, SHELF_BAY_WIDTH / 2 - 7):
            box(name + "_SideFrame", (x + edge, -345, 205), (12, 90, 235), MATS["metal"])
        for level, z in enumerate((125, 175, 225, 275), start=1):
            box(name + "_Empty_Interior_Shelf_%02d" % level, (x, -365, z), (SHELF_BAY_WIDTH - 22, 62, 4), MATS["shelf"])
        # A thin translucent pane is a placeholder for the final physically based glass treatment.
        box(name + "_Glass_Door", (x, -296, 205), (SHELF_BAY_WIDTH - 18, 2, 220), MATS["glass"])
        box(name + "_Door_Handle", (x + SHELF_BAY_WIDTH / 2 - 28, -291, 205), (4, 5, 170), MATS["metal"])
    for bay in range(2):
        x = 2050.0 + bay * 410.0
        name = "Left_Empty_Shelf_Bay_%02d" % (bay + 1)
        box(name + "_Back", (x, -385, 205), (SHELF_BAY_WIDTH, 8, 220), MATS["metal"])
        for edge in (-SHELF_BAY_WIDTH / 2 + 8, SHELF_BAY_WIDTH / 2 - 8):
            box(name + "_Upright", (x + edge, -350, 205), (10, 72, 235), MATS["metal"])
        for level, z in enumerate((48, 94, 140, 186, 228), start=1):
            box(name + "_Empty_Shelf_%02d" % level, (x, -345, z), (SHELF_BAY_WIDTH - 14, 76, 5), MATS["shelf"])

def build_lighting_and_branding():
    # Repeated linear LED housings and point lights create a consistent aisle light rhythm.
    for index, x in enumerate(range(180, 2500, 460), start=1):
        box("Ceiling_LED_%02d" % index, (x, 0, 470), (300, 18, 5), MATS["light"])
        point_light("Ceiling_Point_%02d" % index, (x, 0, 420), 6200.0, 1050.0)
    # Restrained Essentials Mart green header; no promotional or price signage.
    box("Brand_Header", (1320, 0, 435), (520, 22, 90), MATS["green"])
    box("Brand_Header_Wood_Inlay", (1320, -14, 435), (220, 4, 90), MATS["wood"])


def target_point(name, location, yaw=0.0):
    actor = unreal.EditorLevelLibrary.spawn_actor_from_class(
        unreal.TargetPoint, unreal.Vector(location[0], location[1], location[2]),
        unreal.Rotator(0.0, yaw, 0.0)
    )
    actor.set_actor_label(PREFIX + name)
    return actor

def build_product_anchor_grid():
    # Stable empty placement anchors. These are metadata points, not visible products.
    # Each bay gets five shelf-level centres, ready for later catalogue placement.
    for bay in range(BAY_COUNT):
        x = 220.0 + bay * 410.0
        for level, z in enumerate((48, 94, 140, 186, 228), start=1):
            target_point(
                "PRODUCT_ANCHOR_DRY_R_B%02d_L%02d" % (bay + 1, level),
                (x, 302, z + 12)
            )
    for bay in range(4):
        x = 250.0 + bay * 410.0
        for level, z in enumerate((125, 175, 225, 275), start=1):
            target_point(
                "PRODUCT_ANCHOR_CHILL_L%02d_L%02d" % (bay + 1, level),
                (x, -365, z + 12)
            )
    for bay in range(2):
        x = 2050.0 + bay * 410.0
        for level, z in enumerate((48, 94, 140, 186, 228), start=1):
            target_point(
                "PRODUCT_ANCHOR_DRY_L%02d_L%02d" % (bay + 1, level),
                (x, -302, z + 12)
            )

def build_camera_rail():
    # Consistent first-person camera nodes every 1.5 m along the aisle centreline.
    for index, x in enumerate(range(-180, 2521, 150), start=0):
        camera = unreal.EditorLevelLibrary.spawn_actor_from_class(
            unreal.CineCameraActor,
            unreal.Vector(float(x), 0.0, 170.0),
            unreal.Rotator(0.0, 0.0, 0.0)
        )
        camera.set_actor_label(PREFIX + "CAMERA_NODE_%02d" % index)
        camera.get_cine_camera_component().set_editor_property("field_of_view", 92.0)
        camera.tags = ["WalkCameraNode", "Node_%02d" % index]
    # A spline-free sequence of fixed nodes is deliberately easy to inspect and revise.

def build_environment():
    unreal.EditorLevelLibrary.new_level(MAP_PATH)
    # Main polished floor, end wall, side walls and ceiling structure.
    box("Polished_Floor", (1300, 0, -12), (2900, 1100, 24), MATS["floor"])
    box("Far_End_Wall", (2670, 0, 250), (35, 1100, 500), MATS["wall"])
    box("Left_Back_Wall", (1300, -500, 250), (2700, 35, 500), MATS["wall"])
    box("Right_Back_Wall", (1300, 500, 250), (2700, 35, 500), MATS["wall"])
    box("Ceiling_Soffit", (1300, 0, 505), (2700, 1100, 18), MATS["wall"])
    # Open structural ceiling ribs remain visible beneath the soffit edge.
    for index, x in enumerate(range(100, 2700, 520), start=1):
        box("Ceiling_CrossBeam_%02d" % index, (x, 0, 482), (18, 1000, 24), MATS["metal"])
    build_right_shelving()
    build_left_refrigeration()
    build_lighting_and_branding()
    build_product_anchor_grid()
    build_camera_rail()
    # PlayerStart for later engine integration; camera rail nodes are the stable view samples.
    player = unreal.EditorLevelLibrary.spawn_actor_from_class(
        unreal.PlayerStart, unreal.Vector(-220, 0, 110), unreal.Rotator(0, 0, 0)
    )
    player.set_actor_label(PREFIX + "Player_Start")
    unreal.EditorLevelLibrary.save_current_level()
    unreal.EditorAssetLibrary.save_directory(PROJECT_ROOT + "/Materials/WalkMode", only_if_is_dirty=False)
    unreal.log("Essentials Mart empty aisle created at " + MAP_PATH)
    unreal.log("Scene is intentionally empty: no products, price labels, or promotions.")
    unreal.log("Created camera rail nodes at 1.5 m intervals and named future product anchors.")

build_environment()

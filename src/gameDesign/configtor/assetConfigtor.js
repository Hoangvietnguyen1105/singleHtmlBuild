import { BLEND_NORMAL, BLEND_SCREEN, StandardMaterial, Texture } from "playcanvas";
import { AssetLoader } from "../../assetLoader/assetLoader";
import { Game } from "../../game";
import { Util } from "../../helpers/util";
import { Hob } from "../obj/obstacles/Itemlose/hob";

export class AssetConfigurator {
  static config() {
    this._createCanvasFont();
    this._configRoad();
    this._configNumberMaterials();
    this._configWallEndGameMaterial();
    this._configBoss();
    this._configItem();
    this._initGradientMaterial();
  }

  static _createCanvasFont() {
    AssetLoader.createCanvasFont("Arial", 106, "bold");
  }

  static _configNumberMaterials() {
    let mat0 = new StandardMaterial();
    let texRed = AssetLoader.getAssetByKey("BurgerTop_texture").resource;
    let matRed = new StandardMaterial();
    matRed.diffuseMap = texRed;
    AssetLoader.registerAsset(matRed, "mat_red_number", "material");

    let texBlue = AssetLoader.getAssetByKey("BurgerTop_texture").resource;
    let matBlue = new StandardMaterial();
    matBlue.diffuseMap = texBlue;

    //define material for burger
    let texBurger = AssetLoader.getAssetByKey("BurgerTop_texture").resource;
    let matBurger = new StandardMaterial();
    matBurger.diffuseMap = texBurger;

    AssetLoader.registerAsset(matBlue, "mat_blue_number", "material");

    this.setModelMaterial("BurgerBot", matBurger, 0);
    this.setModelMaterial("BurgerTop", matBurger, 0);
    this.setModelMaterial("BurgerItemSalad", matBurger, 0);


  }

  static _initGradientMaterial() {
    let texGradient = AssetLoader.getAssetByKey("tex_gradient").resource;
    let mat = new StandardMaterial();
    mat.diffuse = Util.createColor(0, 0, 0);
    mat.opacityMap = texGradient;
    mat.opacityMapChannel = "r";
    mat.blendType = BLEND_SCREEN;
    mat.alphaTest = 1;
    AssetLoader.registerAsset(mat, "mat_radial_gradient", "material");
  }


  static _configWallEndGameMaterial() {
    let texGradient = AssetLoader.getAssetByKey("tex_gradient").resource;
    let matRed = new StandardMaterial();
    matRed.diffuseTint = true;
    matRed.diffuse = Util.createColor(255, 2, 0);
    matRed.opacityMap = texGradient;
    matRed.blendType = BLEND_NORMAL;
    matRed.opacityMapChannel = "r";
    matRed.depthWrite = false;
    AssetLoader.registerAsset(matRed, "mat_red_wall", "material");

    let matGreen = new StandardMaterial();
    matGreen.diffuseTint = true;
    matGreen.diffuse = Util.createColor(83, 255, 0);
    matGreen.opacityMap = texGradient;
    matGreen.blendType = BLEND_NORMAL;
    matGreen.opacityMapChannel = "g";
    matGreen.depthWrite = false;
    AssetLoader.registerAsset(matGreen, "mat_green_wall", "material");

    let mat1 = new StandardMaterial();
    mat1.diffuseTint = true;
    mat1.diffuse = Util.createColor(255, 255, 13);
    mat1.opacityMap = texGradient;
    mat1.blendType = BLEND_NORMAL;
    mat1.opacityMapChannel = "r";
    mat1.depthWrite = false;
    AssetLoader.registerAsset(mat1, "mat_1_wall", "material");

    let mat2 = new StandardMaterial();
    mat2.diffuseTint = true;
    mat2.diffuse = Util.createColor(215, 255, 20);
    mat2.opacityMap = texGradient;
    mat2.blendType = BLEND_NORMAL;
    mat2.opacityMapChannel = "r";
    mat2.depthWrite = false;
    AssetLoader.registerAsset(mat2, "mat_2_wall", "material");

    let mat3 = new StandardMaterial();
    mat3.diffuseTint = true;
    mat3.diffuse = Util.createColor(174, 255, 26);
    mat3.opacityMap = texGradient;
    mat3.blendType = BLEND_NORMAL;
    mat3.opacityMapChannel = "r";
    mat3.depthWrite = false;
    AssetLoader.registerAsset(mat3, "mat_3_wall", "material");

    let mat4 = new StandardMaterial();
    mat4.diffuseTint = true;
    mat4.diffuse = Util.createColor(134, 255, 33);
    mat4.opacityMap = texGradient;
    mat4.blendType = BLEND_NORMAL;
    mat4.opacityMapChannel = "r";
    mat4.depthWrite = false;
    AssetLoader.registerAsset(mat4, "mat_4_wall", "material");

    let mat5 = new StandardMaterial();
    mat5.diffuseTint = true;
    mat5.diffuse = Util.createColor(94, 255, 39);
    mat5.opacityMap = texGradient;
    mat5.blendType = BLEND_NORMAL;
    mat5.opacityMapChannel = "r";
    mat5.depthWrite = false;
    AssetLoader.registerAsset(mat5, "mat_5_wall", "material");

    let mat6 = new StandardMaterial();
    mat6.diffuseTint = true;
    mat6.diffuse = Util.createColor(63, 255, 44);
    mat6.opacityMap = texGradient;
    mat6.blendType = BLEND_NORMAL;
    mat6.opacityMapChannel = "r";
    mat6.depthWrite = false;
    AssetLoader.registerAsset(mat6, "mat_6_wall", "material");

    let mat7 = new StandardMaterial();
    mat7.diffuseTint = true;
    mat7.diffuse = Util.createColor(101, 255, 38);
    mat7.opacityMap = texGradient;
    mat7.blendType = BLEND_NORMAL;
    mat7.opacityMapChannel = "r";
    mat7.depthWrite = false;
    AssetLoader.registerAsset(mat7, "mat_7_wall", "material");

    let mat8 = new StandardMaterial();
    mat8.diffuseTint = true;
    mat8.diffuse = Util.createColor(140, 255, 32);
    mat8.opacityMap = texGradient;
    mat8.blendType = BLEND_NORMAL;
    mat8.opacityMapChannel = "r";
    mat8.depthWrite = false;
    AssetLoader.registerAsset(mat8, "mat_8_wall", "material");

    let mat9 = new StandardMaterial();
    mat9.diffuseTint = true;
    mat9.diffuse = Util.createColor(178, 255, 25);
    mat9.opacityMap = texGradient;
    mat9.blendType = BLEND_NORMAL;
    mat9.opacityMapChannel = "r";
    mat9.depthWrite = false;
    AssetLoader.registerAsset(mat9, "mat_9_wall", "material");

    let mat10 = new StandardMaterial();
    mat10.diffuseTint = true;
    mat10.diffuse = Util.createColor(217, 255, 19);
    mat10.opacityMap = texGradient;
    mat10.blendType = BLEND_NORMAL;
    mat10.opacityMapChannel = "r";
    mat10.depthWrite = false;
    AssetLoader.registerAsset(mat10, "mat_10_wall", "material");
  }

  static _configRoad() {
    let mat = new StandardMaterial();
    let tex = AssetLoader.getAssetByKey("tex_road").resource;
    mat.diffuse = new pc.Color(74 / 255, 120 / 255, 233 / 255);
    console.log(AssetLoader.getAssetByKey("model_road"))
    this.setModelMaterial("model_road", mat, 0);

    let tex2 = AssetLoader.getAssetByKey("TEST_UV2").resource;
    let mat2 = new StandardMaterial();
    mat2.diffuseMap = tex2;
    // this.setModelMaterial("Straight", mat2, 0);
    this.setModelMaterialInRange("Straight", mat2, 0, 0);
    this.setModelMaterialInRange("Straight", mat, 1, 4);
    this.setModelMaterial("DownhillHigh", mat2, 0);
    this.setModelMaterial("UphillHigh", mat2, 0);
    this.setModelMaterial("BumpyRoad", mat2, 0);
    this.setModelMaterialInRange("cu", mat2, 0, 0);
    this.setModelMaterialInRange("cu", mat, 1, 4);
    this.setModelMaterialInRange("cd", mat2, 0, 0);
    this.setModelMaterialInRange("cd", mat, 1, 4);

  }

  static _configItem() {
    let mat = new StandardMaterial();
    let matCake = new StandardMaterial();
    let matInvisible = new StandardMaterial();
    let tex = AssetLoader.getAssetByKey("Text_All").resource;
    let texHanh_tay = AssetLoader.getAssetByKey("Cake_Filling").resource;


    mat.diffuseMap = tex;
    mat.useGammaTonemap = true
    matInvisible.blendType = BLEND_NORMAL
    matInvisible.opacity = 0

    matCake.diffuseMap = texHanh_tay;


    this.setModelMaterial("Chesse", mat, 0);

    this.setModelMaterial("HotDog", mat, 0);
    this.setModelMaterial("Salad", mat, 0);
    this.setModelMaterial("onion", mat, 0);
    this.setModelMaterial("BurgerItemCheese_1", mat, 0);
    this.setModelMaterial("BurgerItemHotDog", mat, 0);
    this.setModelMaterial("BurgerItemOnion", matCake, 0);
    this.setModelMaterial("Candy1", mat, 0)
    this.setModelMaterial("Candy3", mat, 0)
    this.setModelMaterial("Candy4", mat, 0)
    this.setModelMaterial("Candy5", mat, 0)
    this.setModelMaterial("Cake_Candy_Top", mat, 0)
    this.setModelMaterial("Cake_Candy_Botton", mat, 0)


    // let model = AssetLoader.getAssetByKey("hand_left").resource;
    // console.log(model.meshInstances.length)
    this.setModelMaterialInRange("j1", mat, 0, 2);
    this.setModelMaterialInRange("JumpState2", mat, 0, 2);
    this.setModelMaterialInRange("TheFace", mat, 1, 6);
    this.setModelMaterial("TheFace", matInvisible, 0)
    this.setModelMaterialInRange("Man_1", mat, 0, 2);
    this.setModelMaterialInRange("Hob", mat, 0, 2);
    // set material for hand
    let mat2 = new StandardMaterial();
    mat2.diffuse = Util.createColor(204, 75, 72);
    let mat3 = new StandardMaterial();
    mat3.diffuse = Util.createColor(207, 161, 161);
    mat3.emissive = Util.createColor(216, 127, 108);
    mat3.useLighting = true
    this.setModelMaterial("hand_left", mat3, 0);
    this.setModelMaterial("hand_left", mat2, 1);
    this.setModelMaterial("hand_left", mat2, 2);
    this.setModelMaterial("hand_left", mat2, 3);
    this.setModelMaterial("hand_left", mat2, 5);
    this.setModelMaterial("hand_left", mat2, 7);
    this.setModelMaterial("hand_right", mat3, 0);
    this.setModelMaterial("hand_right", mat2, 1);
    this.setModelMaterial("hand_right", mat2, 2);
    this.setModelMaterialInRange("Fork", mat2, 6, 6);
    this.setModelMaterial("DoubleFork", mat2)
    this.setModelMaterial("polySurface3", mat)
    this.setModelMaterialInRange("Hole", mat2, 8, 19)
    this.setModelMaterialInRange("Path Right", mat2, 6, 11)
    this.setModelMaterialInRange("gian", mat, 0, 2)
    this.setModelMaterial('knife', mat, 0)
    this.setModelMaterial('loxo', mat, 0)
    this.setModelMaterial('Shit', mat, 0)
    this.setModelMaterialInRange('3_Gangster', mat, 1, 2)



    //Door
    let texBurger = AssetLoader.getAssetByKey("BurgerTop_texture").resource;
    let matBurger = new StandardMaterial();
    matBurger.diffuseMap = texBurger;
    let matDoor = new StandardMaterial();
    let matDoor2 = new StandardMaterial()
    matDoor.diffuse = Util.createColor(127, 255, 129)
    matDoor.blendType = BLEND_NORMAL
    matDoor.opacity = 0.2
    matDoor.diffuse = Util.createColor(42, 190, 73)
    this.setModelMaterial('DoorDecor', matDoor, 0)
    this.setModelMaterial('DoorDecor', matDoor2, 3)
    this.setModelMaterial('DoorDecor', matBurger, 1)
    let matUs = new StandardMaterial();
    matUs.diffuse = AssetLoader.getAssetByKey('usaflag')
    this.setModelMaterial('7_Flag US', matUs, 1)
  }



  static _configBoss() {
    let mat = new StandardMaterial();
    let tex = AssetLoader.getAssetByKey("tex_road").resource;
    mat.diffuseMap = tex;

  }

  static _configFinishLine() {
    let mat = new StandardMaterial();
    let tex = AssetLoader.getAssetByKey("tex_finish_line").resource;
    mat.diffuseMap = tex;
    mat.diffuseMapTiling.set(3, 0.37);
    this.setModelMaterial("model_finish_line", mat, 0);
  }

  static _configSkyboxCubemap() {
    let textures = [
      AssetLoader.getAssetByKey("tex_skybox_right"),
      AssetLoader.getAssetByKey("tex_skybox_left"),
      AssetLoader.getAssetByKey("tex_skybox_up"),
      AssetLoader.getAssetByKey("tex_skybox_down"),
      AssetLoader.getAssetByKey("tex_skybox_front"),
      AssetLoader.getAssetByKey("tex_skybox_back"),
    ];
    let cmSkybox = new Texture(Game.app.graphicsDevice, {
      cubemap: true,
    });
    cmSkybox.setSource(textures.map((texture) => texture.resource.getSource()));
    AssetLoader.registerAsset(cmSkybox, "cm_skybox", "cubemap");
  }

  /**
   * @param {pc.Texture} texture
   */
  static setTextureFiltering(texture, filter = FILTER_NEAREST, address = ADDRESS_REPEAT) {
    texture.minFilter = filter;
    texture.magFilter = filter;
    texture.addressU = address;
    texture.addressV = address;
  }

  static setSpriteSlice(spriteAsset, border = new Vec4(), pixelsPerUnit = 1) {
    let asset = AssetLoader.getAssetByKey(spriteAsset);
    asset.resource.renderMode = SPRITE_RENDERMODE_SLICED;
    this.setSpriteBorder(asset, border.x, border.y, border.z, border.w);
    this.setSpritePixelsPerUnit(spriteAsset, pixelsPerUnit);
  }

  static setSpriteBorder(spriteAsset, left = 0, bottom = 0, right = 0, top = 0) {
    let sprite = AssetLoader.getAssetByKey(spriteAsset).resource;
    sprite.atlas.frames[sprite.frameKeys[0]].border.set(left, bottom, right, top);
  }

  static setSpritePixelsPerUnit(spriteAsset, pixelsPerUnit = 100) {
    let sprite = AssetLoader.getAssetByKey(spriteAsset).resource;
    sprite.pixelsPerUnit = pixelsPerUnit;
  }

  static setModelTexture(modelAsset, textureAsset, index = 0) {
    let material = this.getMaterial(modelAsset, index);
    let texture = AssetLoader.getAssetByKey(textureAsset);
    material.diffuseMap = texture.resource;
  }

  static setModelDiffuse(modelAsset, color, index = 0) {
    let material = this.getMaterial(modelAsset, index);
    material.diffuse.copy(color);
    material.diffuseTint = true;
  }

  static setModelMaterial(modelAsset, material, index = 0) {
    let model = AssetLoader.getAssetByKey(modelAsset).resource;
    model.meshInstances[index].material = material;
  }

  static setModelMaterialInRange(modelAsset, material, startIndex, endIndex) {
    for (var i = startIndex; i <= endIndex; i++) {
      this.setModelMaterial(modelAsset, material, i);
    }
  }

  static setModelMaterialWithIndexes(modelAsset, material, indexes = []) {
    indexes.forEach((index) => {
      this.setModelMaterial(modelAsset, material, index);
    });
  }

  static createColorMaterial(r = 255, g = 255, b = 255, a = 1) {
    let material = new StandardMaterial();
    if (typeof r === "object") {
      material.diffuse = r;
    }
    else {
      material.diffuse = Util.createColor(r, g, b, a);
    }
    return material;
  }

  /**
   * @param {string} modelName
   * @returns {pc.StandardMaterial}
   */
  static getMaterial(modelName, index = 0) {
    let model = AssetLoader.getAssetByKey(modelName);
    let material = model.resource.meshInstances[index].material;

    if (material.id === 1) { // default material
      material = new StandardMaterial();
      model.resource.meshInstances[index].material = material;
    }

    return material;
  }
}
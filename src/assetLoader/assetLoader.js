import * as pc from "playcanvas";
import assetData from "../../assets/jsons/assetData.json";
import assetBase64 from "../../assets/jsons/assetB64.json"
import { SoundManager } from "../soundManager";
import { AssetDecoder } from "../../scripts/AssetDecoder";

export class AssetLoader {

  static loadAssets(app, callback) {
    this.app = app;
    this.textures = [];
    this._loadedTexture = 0;
    this._textureAtlases = [];
    this.assets = [];
    let keysModel = Object.keys(assetBase64.models);
    let keysTexture = Object.keys(assetBase64.textures);
    let keysAudio = Object.keys(assetBase64.audios);
    let keysAnimation = Object.keys(assetBase64.animations);
    let i = 0
    keysModel.forEach((key) => {
      // this.createTexture(assetBase64.textures[key], key);
      AssetDecoder.decodeModelAsync(assetBase64.models[key], key)
        .then((newAsset) => {
          // newAsset.type = 'model'
          newAsset.resource.model.name = key
          this.assets.push(newAsset.resource.model)
        })
    });

    keysTexture.forEach((key) => {
      // this.createTexture(assetBase64.textures[key], key);
      AssetDecoder.decodeTextureAsync(assetBase64.textures[key], key)
        .then((newAsset) => {
          // newAsset.type = 'model'
          this.assets.push(newAsset)
        })
    });

    keysAnimation.forEach((key) => {
      // this.createTexture(assetBase64.textures[key], key);
      AssetDecoder.decodeAnimationAsync(assetBase64.animations[key], key)
        .then((newAsset) => {
          newAsset.resource.animations[0].name = key
          this.assets.push(newAsset.resource.animations[0])
        })
    });

    keysAudio.forEach((key) => {
      // this.createTexture(assetBase64.textures[key], key);
      AssetDecoder.decodeAudioAsync(assetBase64.audios[key], key)
        .then((newAsset) => {
          // newAsset.type = 'model'
          this.assets.push(newAsset)
        })
    });
    this.loadAssets2(app, callback)

  }
  static loadAssets2(app, callback) {

    assetData.forEach((data) => {
      if (data.type === "sprite") {
        this.createTexture(data.url, data.key);
      }
      else if (data.type !== 'model' && data.type !== 'texture' && data.type !== "audio" && data.type !== 'animation') {
        console.log(data.type)
        let asset = new pc.Asset(data.key, data.type, {
          url: data.url,
        });
        if (data.type === 'animation') console.log(asset)
        this.assets.push(asset);
      }
    });
    const assetListLoader = new pc.AssetListLoader(
      this.assets,
      this.app.assets
    );

    assetListLoader.load((err, failed) => {
      this._loadTextures(() => {
        console.log('load')
        this._loadTextureAtlases();
        this._loadSpriteAssets();
        this.audioAssets = this.assets.filter((asset) => asset.type === "audio");
        SoundManager.initSound(this.audioAssets);
        callback();
      });
      if (err) {
        console.error(`${failed.length} assets failed to load`);
      } else {
        console.log(`${this.assets.length} assets loaded`);
      }
    });
  }

  static getAssetByKey(id) {
    return this.assets.find((asset) => asset.name === id);
  }

  static createTexture(src, key) {
    let tex = new pc.Texture(this.app.graphicsDevice);
    tex.src = src;
    tex.name = key;
    this.textures.push(tex);
    // const base64Data = src; // Your base64 string here
    // console.log(base64Data)
    // const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    // const asset = new pc.Asset('MyModel', 'model', { url: '', data: buffer.buffer });
    // console.log(asset)
    // var tex = src
    // var asset = new pc.Asset(key, 'texture', {
    //   url: tex // not sure exactly what you want to put in here, empty string might be fine
    // });

    // console.log(asset)
    return tex;
  }


  static _loadSpriteAssets() {
    this._textureAtlases.forEach((tex) => {
      let sprite = new pc.Sprite(this.app.graphicsDevice);
      sprite.atlas = tex;
      sprite.frameKeys = Object.keys(tex.frames);
      sprite.pixelsPerUnit = 100;
      let asset = new pc.Asset(tex.texture.name, "sprite");
      asset.resource = sprite;
      asset.loaded = true;
      this.app.assets.add(asset);
      this.assets.push(asset);
    });
  }

  static _loadTextureAtlases() {
    this.textures.forEach((tex) => {
      let textureAtlas = new pc.TextureAtlas();
      textureAtlas.texture = tex;
      textureAtlas.frames = this.getAtlasFrame(tex);
      this._textureAtlases.push(textureAtlas);
    });
  }

  static registerAsset(object, key, type) {
    let asset = new pc.Asset(key, type, null);
    asset.resource = object;
    asset.loaded = true;
    this.app.assets.add(asset);
    this.assets.push(asset);
  }

  static getAtlasFrame(texture) {
    let frames = {};
    frames[texture.name] = {
      rect: new pc.Vec4(0, 0, texture.width, texture.height),
      pivot: new pc.Vec2(0.5, 0.5),
      border: new pc.Vec4(0, 0, 0, 0),
    };
    return frames;
  }

  static _loadTextures(onLoad) {
    this.onLoadTextures = onLoad;
    if (this.textures.length === 0) {
      this.onLoadTextures && this.onLoadTextures();
      return;
    }
    for (let index = 0; index < this.textures.length; index++) {
      this._loadTexture(this.textures[index]);
    }
  }

  static _loadTexture(texture) {
    texture.minFilter = pc.FILTER_LINEAR;
    texture.mapFilter = pc.FILTER_LINEAR;
    texture.addressU = pc.ADDRESS_REPEAT;
    texture.addressV = pc.ADDRESS_REPEAT;

    let img = document.createElement("img");
    img.onload = () => {
      texture.setSource(img);
      texture.mipmaps = true;
      this._onOneTextureLoaded();
    };
    if (texture.src)
      img.src = texture.src;
  }

  static _onOneTextureLoaded() {
    this._loadedTexture++;
    if (this._loadedTexture >= this.textures.length) {
      this.onLoadTextures && this.onLoadTextures();
    }
  }

  static createCanvasFont(name, fontSize, fontWeight) {
    let canvasFontArial = new pc.CanvasFont(this.app, {
      color: new pc.Color(1, 1, 1),
      fontName: name,
      fontSize: fontSize,
      fontWeight: fontWeight,
    });
    canvasFontArial.createTextures("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?-+/():;%&`'*#=[]\"");
    let fontAsset = new pc.Asset("CanvasFont", "font", {});
    fontAsset.resource = canvasFontArial;
    fontAsset.loaded = true;
    this.app.assets.add(fontAsset);
    this.assets.push(fontAsset);
    return fontAsset;
  }

}
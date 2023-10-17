import { loadObitCameraPlugin } from "../src/orbit-camera";
import { AssetLoader } from "./assetLoader/assetLoader";
import { SceneManager } from "./template/scene/sceneManager";
import { GameConstant } from "./gameConstant";
import { InputManager } from "./template/systems/input/inputManager";
import { Time } from "./template/systems/time/time";
import { Tween } from "./template/systems/tween/tween";
import { Application, ElementInput, Keyboard, Mouse, TouchDevice, FILLMODE_FILL_WINDOW, RESOLUTION_AUTO } from "playcanvas";
import { PlayScene } from "./gameDesign/scenes/playScene";
import { GameStateManager, GameState } from "./template/gameStateManager";
import { Configurator } from "./gameDesign/configtor/configtor";
import { DataLocalEvent, DataLocal } from "./gameDesign/data/dataLocal";
import { Physics } from "./physics/physics";
import { DataManager } from "./gameDesign/data/dataManager";
import { LoadingScene } from "./gameDesign/scenes/loadingScene";
import { AdsManager } from "../adSdk/adsManager";
import { AdBannerSize, AdEvent } from "../adSdk/adsConstant";
import { SoundManager } from "./soundManager";
export class Game {


  static init() {
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    this.app = new Application(canvas, {
      elementInput: new ElementInput(canvas),
      keyboard: new Keyboard(window),
      mouse: new Mouse(canvas),
      touch: new TouchDevice(canvas),
    });
    this.app.setCanvasFillMode(FILLMODE_FILL_WINDOW);
    this.app.setCanvasResolution(RESOLUTION_AUTO);
    this.app.graphicsDevice.maxPixelRatio = window.devicePixelRatio;
    window.addEventListener("resize", () => this.app.resizeCanvas);
    if (GameConstant.DEBUG_FPS) {
      this.debugFPS();
    }


    pc.AudioHandler.prototype._isSupported = (url) => {
      return true;
    }

    loadObitCameraPlugin();
    AssetLoader.loadAssets(this.app, () => {
      this.load();
      this.create();
      this.initBannerAds();

    });
  }

  static load() {
    InputManager.init(this.app);
    GameStateManager.init(GameState.Tutorial);
    Time.init(this.app);
    Tween.init(this.app);
    Configurator.config(this.app);
    this.app.on(DataLocalEvent.Initialize, () => {
      DataManager.init();
    });
    DataLocal.init();
    Physics.init(this.app);
    this.app.start();
  }
  static initBannerAds() {
    AdsManager.init();
    AdsManager.emitter.on(AdEvent.AD_ERROR, this.showPopup, this);
    let id = "banner-ads";
    this.bannerAdsElement = document.createElement("div");
    this.bannerAdsElement.id = id;
    this.bannerAdsStyle = this.bannerAdsElement.style;
    document.body.appendChild(this.bannerAdsElement);

    AdsManager.emitter.on(AdEvent.AD_INIT_COMPLETED, () => {
      this.showBannerAds();
    });
  }
  static showPopup() {
    // TODO: create popup scene and show popup by content: ads is not available
  }
  static showBannerAds() {
    AdsManager.hasAdblock((isBlock) => {
      if (isBlock) {
        return;
      }
      this.bannerAdsStyle.width = "100%";
      this.bannerAdsStyle.height = "auto";
      this.bannerAdsStyle.inset = "auto 0 0 0";
      AdsManager.showBanner(this.bannerAdsElement.id, AdBannerSize.SIZE2);
      this.onResizeBannerAds();
    });
  }
  static create() {
    this.numberBatch = this.app.batcher.addGroup("Number", true, 1000);
    this.sphereBatch = this.app.batcher.addGroup("Sphere", true, 100);
    this.gameCreated = true;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.app.graphicsDevice.maxPixelRatio = window.devicePixelRatio;
    this.app.resizeCanvas(this.width, this.height);
    SceneManager.init([
      new LoadingScene,
      new PlayScene()
    ]);
    SceneManager.loadScene(SceneManager.getScene(GameConstant.SCENE_LOADING));
    this.sceneLoading = SceneManager.getScene(GameConstant.SCENE_LOADING);
    this.scenePlay = SceneManager.getScene(GameConstant.SCENE_PLAY);
    this.app.on("update", this.update, this);

  }
  static replay() {
    GameStateManager.state = GameState.Tutorial;
    //this.showBannerAds();
  }

  static update(dt) {
    SceneManager.update(Time.dt);
  }
  static pause() {
    GameStateManager.state = GameState.Paused;
    Time.scale = 0;
    SoundManager.muteAll(true);
    SceneManager.pause();
  }
  static resume() {
    GameStateManager.state = GameStateManager.prevState;
    Time.scale = 1;
    SoundManager.muteAll(false);
    SceneManager.resume();
  }
  static resize(screenSize) {
    if (this.gameCreated) {
      this.width = screenSize.width;
      this.height = screenSize.height;
      this.app.graphicsDevice.maxPixelRatio = window.devicePixelRatio;
      this.app.resizeCanvas(this.width, this.height);
      SceneManager.resize();
      this.app.fire("resize");
    }
  }

  static isPortrait() {
    return this.width < this.height;
  }

  static isLandscape() {
    return this.width > this.height;
  }

  static onResizeBannerAds() { }

}

window.addEventListener("contextmenu", (e) => e.preventDefault());
// eslint-disable-next-line no-undef

window.onload = function () {
  Game.init();
}

window.addEventListener("resize", (event) => {
  Game.resize({ width: window.innerWidth, height: window.innerHeight })
});


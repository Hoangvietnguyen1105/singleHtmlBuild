import { GameConstant } from "../../../gameConstant";
import { UIScreen } from "../../../template/ui/uiScreen";
import { ObjectFactory } from "../../../template/objects/objectFactory";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { ELEMENTTYPE_IMAGE, ELEMENTTYPE_TEXT, Entity, Vec2, Vec4 } from "playcanvas";
import { LoadingBar } from "../objects/loadingBar";
import { Util } from "../../../helpers/util";
import { Game } from "../../../game";

export class LoadingScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_LOADING);
    this._initBg();
    this._initGameLogo();
    this._initGameName();
    this._initLoadingBar();
  }

  create() {
    super.create();
  }

  _initBg() {
    this.bgPtr = new Entity("bg");
    this.bgPtr.addComponent("element", {
      type: ELEMENTTYPE_IMAGE,
      spriteAsset: AssetLoader.getAssetByKey("bg"),
      anchor: new Vec4(0, 0, 1, 1),
      pivot: new Vec2(0.5, 0.5),
      margin: new Vec4(0, -200, 0, 0),
    });
    this.addChild(this.bgPtr);

    this.bgLsc = new Entity("bgLsc");
    this.bgLsc.addComponent("element", {
      type: ELEMENTTYPE_IMAGE,
      spriteAsset: AssetLoader.getAssetByKey("bg_landscape"),
      anchor: new Vec4(0, 0, 1, 1),
      pivot: new Vec2(0.5, 0.5),
      margin: new Vec4(0, 0, 0, 0),
    });
    this.addChild(this.bgLsc);
    this._onResizeBg();
  }

  _onResizeBg() {
    if(Game.isLandscape()) {
      this.bgPtr.enabled = false;
      this.bgLsc.enabled = true;
    } else {
      this.bgPtr.enabled = true;
      this.bgLsc.enabled = false;
    }
  }

  _initGameLogo() {
    this.gameLogo = ObjectFactory.createImageElement("logo copy");
    this.addChild(this.gameLogo);
    this.onResizeGameLogo();
  }

  _initGameName() {
    this.gameName = ObjectFactory.createImageElement("spr_game_name");
    this.gameName.setLocalScale(1.3, 1.3, 1.3);
   // this.addChild(this.gameName);
    this.onResizeGameName();
  }

  _initLoadingBar() {
    this.loadingBar = new LoadingBar({
      anchor: new Vec4(0.5, 0.2, 0.5, 0.2),
      width: 500,
      height: 50,
      color: Util.createColor(0, 197, 255)
    });
    this.loadingBar.start();
    this.addChild(this.loadingBar);
  }

  _initLoadingText() {
    this.loadingText = new Entity("loadingText");
    this.loadingText.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.5, 0.2, 0.5, 0.2),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 56,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("font_ariston_comic"),
      text: "Loading...",
      color: Util.createColor(73, 195, 46),
      outlineThickness: 0.2,
      outlineColor: Util.createColor(0, 0, 0)
    });
    this.addChild(this.loadingText);
    this.loadingText.setLocalPosition(160, -50, 0);
  }

  onResizeGameLogo() {
    let anchor = new Vec4(0.5, 0.7, 0.5, 0.7);
    // if (Game.isLandscape()) {
    //   anchor = new Vec4(0.2, 0.65, 0.2, 0.65);
    // }
    this.gameLogo.setLocalScale(0.5,0.5,0.5)
    this.gameLogo.element.anchor = anchor;
  }

  onResizeGameName() {
    let anchor = new Vec4(0.5, 0.4, 0.5, 0.4)
    if (Game.isLandscape()) {
      anchor = new Vec4(0.7, 0.65, 0.7, 0.65);
    }
    this.gameName.element.anchor = anchor;
  }

  resize() {
    super.resize();
    this.onResizeGameLogo();
    this.onResizeGameName();
    this._onResizeBg();
  }

  update() {
    super.update();
    this.loadingBar.update();
  }

}
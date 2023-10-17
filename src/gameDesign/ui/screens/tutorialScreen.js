import { ELEMENTTYPE_TEXT, Entity, Vec2, Vec4 } from "playcanvas";
import { GameConstant } from "../../../gameConstant";
import { Util } from "../../../helpers/util";
import { GameState, GameStateManager } from "../../../template/gameStateManager";
import { ObjectFactory } from "../../../template/objects/objectFactory";
import { UIScreen } from "../../../template/ui/uiScreen"
import { Tween } from "../../../template/systems/tween/tween";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { Game } from "../../../game";
import { UserData } from "../../data/userData";
export const TutorialScreenEvent = Object.freeze({
  ButtonIncomeClicked: "buttonIncomeClicked",
  ButtonStartNumberClicked: "buttonStartNumberClicked",
  OnTapBackground: "onTapBackground",
});
export class TutorialScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_TUTORIAL);

    this._initFakeBg();
    this._initTutorial();
    this._initGameName();
    this.resize();
  }

  _initFakeBg() {
    this.fakeBg = ObjectFactory.createUIBackground();
    this.addChild(this.fakeBg);
    this.fakeBg.element.opacity = 0;
    Util.registerOnTouch(this.fakeBg.element, this._onTapBg, this);
  }

  _initTutorial() {
    this.arrow = ObjectFactory.createImageElement("spr_arrow", {
      anchor: new Vec4(0.5, 0.4, 0.5, 0.4),
    });
    this.addChild(this.arrow);
    this.hand = ObjectFactory.createImageElement("spr_hand", {
      anchor: new Vec4(0.15, 0, 0.15, 0),
    });
    this.arrow.addChild(this.hand);
    this.tweenHand = Tween.createLocalTranslateTween(this.hand, { x: 360 }, {
      duration: 1,
      delay: 0,
      easing: Tween.Easing.Sinusoidal.InOut,
      loop: true,
      yoyo: true,
    });
  }

  _initGameName() {
    this.textDropShadow = new pc.Entity();
    this.textDropShadow.setLocalPosition(0, -200, 0);
    this.textDropShadow.addComponent("element", {
      pivot: new pc.Vec2(0.5, 0.5),
      anchor: new pc.Vec4(0.5, 0.45, 0.5, 0.45),
      fontAsset: AssetLoader.getAssetByKey('JandaManateeSolid'),
      fontSize: 80,
      text: "Tap to play",
      shadowColor: new pc.Color(1, 0, 0),
      shadowOffset: new pc.Vec2(0.25, -0.25),
      type: pc.ELEMENTTYPE_TEXT,
      color: Util.createColor(255, 255, 255), // Màu xanh cho văn bản
      outlineColor: new pc.Color(0, 0, 0), // Màu viền xanh
      outlineThickness: 0.5, // Độ dày của viền
    });
    this.textDropShadow.setLocalPosition(0, -300, 0)
    this.addChild(this.textDropShadow);
    this.tweenScale = Tween.createScaleTween(this.textDropShadow, { x: 0.7, y: 0.7, z: 0.7 }, {
      duration: 0.7,
      yoyo: true,
      loop: true,
      delay: 0.2,
    }).start();
  }

  play() {
    this.tweenHand?.stop();
    this.tweenHand.start();
  }

  stop() {
    this.tweenHand?.stop();
  }

  _onTapBg() {
    this.fire(TutorialScreenEvent.OnTapBackground);
  }

  playAnimBtnNumberCount() {
    this.tweenButtonNumberCount?.stop();
    this.tweenButtonNumberCount.start();
  }

  playAnimBtnIncome() {
    this.tweenButtonIncome?.stop();
    this.tweenButtonIncome.start();
  }

  resize() {
    super.resize();
    let scale = 1;
    let y = -300;
    // let yHand = 
    if (Game.height < Game.width) {
      scale = 0.5;
      y = -150;
    }
    this.textDropShadow.setLocalPosition(0, y, 0);
    this.arrow.setLocalScale(scale, scale, scale);
  }
}
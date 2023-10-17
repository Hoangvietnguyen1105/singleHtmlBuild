import { ELEMENTTYPE_IMAGE, ELEMENTTYPE_TEXT, Entity, Sprite, TextureAtlas, Vec2, Vec3, Vec4 } from "playcanvas";
import { GameConstant } from "../../../gameConstant";
import { Util } from "../../../helpers/util";
import { ObjectFactory } from "../../../template/objects/objectFactory";
import { UIScreen } from "../../../template/ui/uiScreen"
import { Tween } from "../../../template/systems/tween/tween";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import confetti from "canvas-confetti"
import { Game } from "../../../game";
export const LoseScreenEvent = Object.freeze({
  ButtonTryAgainClicked: "buttonTryAgainClicked",
});
export class LoseScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_LOSE);
    this.ernMoney = 111
    this.claimMoney = 111

    this._initFakeBg();
    this._initPanel();
    // this._initTextComplete();

    // this._initIconSmile();
    this._initButtonGetMoney()
    this._initLightBehindItem()
    this._initUnlockItem()
  }

  create() {
    super.create();
  }

  resize() {
    super.resize();
    this._resizeConfetti();
  }



  _resizeConfetti() {
    this.confettiCanvas.width = Game.width;
    this.confettiCanvas.height = Game.height;
  }





  _initFakeBg() {
    this.fakeBg = ObjectFactory.createUIBackground();
    this.addChild(this.fakeBg);
    this.fakeBg.element.opacity = 0.7;
  }

  _initPanel() {
    this.panel = new Entity()
    this.panel.addComponent("element", {
      type: ELEMENTTYPE_IMAGE,
      anchor: new pc.Vec4(0, 0, 1, 1),
      pivot: new pc.Vec2(0, 0),
      color: new pc.Color(84 / 255, 75 / 255, 102 / 255),
      opacity: 1,
      width: 1280,
      height: 720,
    });
    this.addChild(this.panel);
  }


  destroy() {
    super.destroy();
    this.stop();
  }



  smile() {
    this.tweenSmile?.stop();
    this.tweenSmile.start();
  }

  stop() {
    this.tween?.stop();
  }



  _initButtonGetMoney() {
    this.btnGet = ObjectFactory.createImageElement("frame_1", {
      anchor: new Vec4(0.5, 0.2, 0.5, 0.2),
      pivot: new Vec2(0.5, 0.5)
    });
    this.btnGet.setLocalScale(0.5, 0.3, 1)
    // this.btnGet.setLocalPosition(0, -150, 0);
    this.panel.addChild(this.btnGet);
    let textGet = new Entity();
    textGet.setLocalScale(1.5, 2, 2)
    textGet.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.5, 0.4, 0.5, 0.4),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 32,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("JandaManateeSolid"),
      text: "TRY AGAIN",
      color: Util.createColor(255, 255, 255),
      outlineThickness: 0.4,
      outlineColor: Util.createColor(0, 0, 0)
    });
    this.btnGet.addChild(textGet);
    Util.registerOnTouch(this.btnGet.element, this._onTapButtonContinue, this);
  }

  _initLightBehindItem() {
    this.halo = ObjectFactory.createImageElement("light", {
      anchor: new Vec4(0.5, 0.6, 0.5, 0.6),
      pivot: new Vec2(0.5, 0.5)
    });
    this.panel.addChild(this.halo)
    this.tweenRotate = Tween.createRotateTween(this.halo, {
      x: 0, y: 0, z: 360,
    }, {
      duration: 7,
      loop: true
    }).start();
  }
  _initUnlockItem() {
    this.unlockItem = ObjectFactory.createImageElement("Lost", {
      anchor: new Vec4(0.5, 0.6, 0.5, 0.6),
      pivot: new Vec2(0.5, 0.5)
    });
    //this.unlockItem.element.color = Util.createColor(0, 0, 0)
    this.panel.addChild(this.unlockItem)


  }
  _onTapButtonContinue() {
    this.fire(LoseScreenEvent.ButtonTryAgainClicked);
  }
}
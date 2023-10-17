import { ELEMENTTYPE_IMAGE, ELEMENTTYPE_TEXT, Entity, Sprite, TextureAtlas, Vec2, Vec3, Vec4 } from "playcanvas";
import { GameConstant } from "../../../gameConstant";
import { Util } from "../../../helpers/util";
import { ObjectFactory } from "../../../template/objects/objectFactory";
import { UIScreen } from "../../../template/ui/uiScreen"
import { Tween } from "../../../template/systems/tween/tween";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import confetti from "canvas-confetti"
import { Game } from "../../../game";
import smileAtlasData from "../../../../assets/jsons/icon_smile_anim.json"
export const WinScreenEvent = Object.freeze({
  ButtonContinueClicked: "buttonContinueClicked",
});
export class WinScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_WIN);
    this.ernMoney = 111
    this.claimMoney = 111

    this._initFakeBg();
    this._initPanel();
    // this._initTextComplete();
    //this._initLucky_1()

    this._initButtonClaim();
    // this._initIconSmile();
    this._initConfetti();
    // this._initButtonGetMoney()
    //this._initFrameLucky()
    this._initUnlockItem()
    // this._initIconSmile();
    //this.itemWin()

  }

  create() {
    super.create();
    this.fireEffect();
  }

  resize() {
    super.resize();
    this._resizeConfetti();
  }

  _initConfetti() {
    this.confettiCanvas = document.createElement("canvas");
    document.body.appendChild(this.confettiCanvas);
    this.confettiCanvas.style.position = "fixed";
    this.confettiCanvas.style.top = "0";
    this.confettiCanvas.style.left = "0";
    this.confettiCanvas.style.pointerEvents = "none";
    this.confettiCanvas.style.zIndex = 100;
    this.confettiCanvas.style.backgroundColor = "transparent";
    this.confettiCanvas.width = Game.width;
    this.confettiCanvas.height = Game.height;

    this.confetti = confetti.create(this.confettiCanvas, {
      resize: true,
    });
  }

  _resizeConfetti() {
    this.confettiCanvas.width = Game.width;
    this.confettiCanvas.height = Game.height;
  }

  fireEffect() {
    this.tween?.stop();
    this.tween = Tween.createCountTween({
      duration: 2,
      loop: true,
      onStart: () => {
        this.playFx();
      },
      onRepeat: () => {
        this.playFx();
      }
    }).start();
  }

  playFx() {

    this.confetti({
      particleCount: 100,
      spread: 50,
      origin: { x: 0, y: 1 },
      angle: 80,
      scalar: 2,
      startVelocity: 100,
    });
    this.confetti({
      particleCount: 100,
      spread: 50,
      origin: { x: 1, y: 1 },
      angle: 100,
      scalar: 2,
      startVelocity: 100,
    });
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
  _initIconSmile() {
    let texture = AssetLoader.getAssetByKey("tex_icon_smile_anim").resource;
    let textureAtlas = new TextureAtlas();
    textureAtlas.texture = texture;
    textureAtlas.frames = [];
    Object.keys(smileAtlasData.frames).forEach((key) => {
      let frame = smileAtlasData.frames[key];
      let y = texture.height - frame.frame.y - frame.frame.h;
      textureAtlas.setFrame(key, {
        rect: new Vec4(frame.frame.x, y, frame.frame.w, frame.frame.h),
        pivot: new Vec2(0.5, 0.5),
        border: new Vec4(0, 0, 0, 0),
      });
    });
    let sprite = new Sprite(Game.app.graphicsDevice, {
      atlas: textureAtlas,
      frameKeys: Object.keys(smileAtlasData.frames),
      pixelsPerUnit: 100,
      renderMode: pc.SPRITE_RENDERMODE_SIMPLE,
    });
    this.icon = new Entity("smile_icon");
    this.icon.addComponent("element", {
      type: ELEMENTTYPE_IMAGE,
      sprite: sprite,
      anchor: new Vec4(0.47, 0.4, 0.47, 0.4),
      pivot: new Vec2(0.5, 0.5),
    });
    this.panel.addChild(this.icon);
    this._initSmileTween();
    this.smile();
  }
  _initSmileTween() {
    let totalFrame = 20;
    this.tweenSmile = Tween.createTween({ t: 0 }, { t: totalFrame }, {
      duration: totalFrame / 30,
      loop: true,
      onUpdate: (obj) => {
        let index = Math.floor(obj.t);
        this.icon.element.spriteFrame = index;
        let frameName = Object.keys(smileAtlasData.frames)[index];
        let frame = smileAtlasData.frames[frameName];
        this.icon.element.width = frame.frame.w;
        this.icon.element.height = frame.frame.h;
      }
    });
  }

  smile() {
    this.tweenSmile?.stop();
    this.tweenSmile.start();
  }


  destroy() {
    super.destroy();
    this.stop();
  }

  _initSmileTween() {
    let totalFrame = 20;
    this.tweenSmile = Tween.createTween({ t: 0 }, { t: totalFrame }, {
      duration: totalFrame / 30,
      loop: true,
      onUpdate: (obj) => {
        let index = Math.floor(obj.t);
        this.icon.element.spriteFrame = index;
        let frameName = Object.keys(smileAtlasData.frames)[index];
        let frame = smileAtlasData.frames[frameName];
        this.icon.element.width = frame.frame.w;
        this.icon.element.height = frame.frame.h;
      }
    });
  }

  smile() {
    this.tweenSmile?.stop();
    this.tweenSmile.start();
  }

  stop() {
    this.tween?.stop();
    this.confettiCanvas.style.display = "none";
  }

  play() {
    this.tween.start();
    this.confettiCanvas.style.display = "block";
  }

  _initTextComplete() {
    this.completeText = new Entity();
    this.completeText.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.5, 0.83, 0.5, 0.83),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 56,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("font_ariston_comic"),
      text: GameConstant.COMPLETE_TEXT,
      color: Util.createColor(255, 255, 255),
      outlineThickness: 0.2,
      outlineColor: Util.createColor(0, 0, 0)
    });
    this.panel.addChild(this.completeText);
  }

  _initButtonClaim() {
    this.btnClaim = ObjectFactory.createImageElement("spr_btn_green", {
      anchor: new Vec4(0.5, 0.3, 0.5, 0.3),
    });
    this.panel.addChild(this.btnClaim);
    let videoImg = ObjectFactory.createImageElement("icon_video", {
      anchor: new Vec4(0.2, 0.85, 0.2, 0.85),
      pivot: new Vec2(0.5, 1)
    });

    // this.btnClaim.addChild(videoImg)
    videoImg.setLocalScale(0.4, 0.35, 0.35)
    this.textClaim = new Entity();
    this.textClaim.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.5, 0.75, 0.5, 0.75),
      pivot: new Vec2(0.5, 1),
      fontSize: 28,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("JandaManateeSolid"),
      text: "Next Lv",
      color: Util.createColor(255, 255, 255),
      outlineThickness: 0.4,
      outlineColor: Util.createColor(0, 0, 0)
    });
    this.moneyClaim = new Entity();
    this.moneyClaim.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.5, 0.5, 0.5, 0.5),
      pivot: new Vec2(0.5, 1),
      fontSize: 24,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("JandaManateeSolid"),
      text: this.claimMoney,
      color: Util.createColor(255, 255, 255),
      outlineThickness: 0.4,
      outlineColor: Util.createColor(0, 0, 0)
    });
    this.btnClaim.addChild(this.textClaim);
    // this.btnClaim.addChild(this.moneyClaim)

    Util.registerOnTouch(this.btnClaim.element, this._onTapButtonContinue, this);
    let moneyImg = ObjectFactory.createImageElement("icon_money_2", {
      anchor: new Vec4(0.759, 0.35, 0.759, 0.35),
    });
    // this.btnClaim.addChild(moneyImg)
    // moneyImg.setLocalPosition(60, 28, 0)
    moneyImg.setLocalScale(0.35, 0.35, 0.35)
    this.tweenBtnContinue = Tween.createScaleTween(this.btnClaim, new Vec3(1.2, 1.2, 1.2), {
      duration: 0.5,
      easing: Tween.Easing.Sinusoidal.InOut,
      loop: true,
      yoyo: true,
    }).start();
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
      anchor: new Vec4(0.2, 0.4, 0.2, 0.4),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 32,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("JandaManateeSolid"),
      text: GameConstant.GET_TEXT,
      color: Util.createColor(255, 255, 255),
      outlineThickness: 0.4,
      outlineColor: Util.createColor(0, 0, 0)
    });

    let moneyImg = ObjectFactory.createImageElement("icon_money_2", {
      anchor: new Vec4(0.5, 0.5, 0.414, 0.5),
    });
    let moneyClaim = new Entity();
    moneyClaim.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.8, 0.5, 0.8, 0.5),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 54,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("JandaManateeSolid"),
      text: this.claimMoney,
      color: Util.createColor(255, 255, 255),
      outlineThickness: 0.4,
      outlineColor: Util.createColor(0, 0, 0)
    });
    this.btnGet.addChild(moneyClaim)
    this.btnGet.addChild(moneyImg)

    this.btnGet.addChild(textGet);
    Util.registerOnTouch(this.btnGet.element, this._onTapButtonContinue, this);

    // this.tweenBtnContinue = Tween.createScaleTween(this.btnGet, new Vec3(0.7, 0.7, 0.7), {
    //   duration: 2.5,
    //   easing: Tween.Easing.Sinusoidal.InOut,
    //   loop: true,
    //   yoyo: true,
    // }).start();
  }

  _initFrameLucky() {
    this.frameLucky = ObjectFactory.createImageElement("frame_lucky", {
      anchor: new Vec4(0.5, 0.5, 0.5, 0.5),
    });
    this.frameLucky.setLocalScale(0.5, 0.5, 0.5)
    this.panel.addChild(this.frameLucky)
    this.X2 = new Entity()
    this.X2 = ObjectFactory.createImageElement("cuoi", {
      anchor: new Vec4(0.15, 0.45, 0.15, 0.45),
      width: 100,
      height: 100
    });
    // this.X2.setLocalScale(0.9) 
    this.secondX2 = new Entity()
    this.secondX2 = ObjectFactory.createImageElement("cuoi", {
      anchor: new Vec4(0.85, 0.45, 0.85, 0.45),
      width: 100,
      height: 100
    });
    this.X3 = new Entity()
    this.X3 = ObjectFactory.createImageElement("cry", {
      anchor: new Vec4(0.33, 0.7, 0.33, 0.7),
      width: 100,
      height: 100
    });
    this.secondX3 = new Entity()
    this.secondX3 = ObjectFactory.createImageElement("cry", {
      anchor: new Vec4(0.67, 0.7, 0.67, 0.7),
      width: 100,
      height: 100
    });
    this.X5 = new Entity()
    this.X5 = ObjectFactory.createImageElement("ngac-nhien", {
      anchor: new Vec4(0.5, 0.8, 0.5, 0.8),
      width: 100,
      height: 100
    });
    this.frameLucky.addChild(this.X2)
    this.frameLucky.addChild(this.secondX2)
    this.frameLucky.addChild(this.X3)
    this.frameLucky.addChild(this.secondX3)
    this.frameLucky.addChild(this.X5)
  }
  _initLucky_1() {

    this.lucky_1 = ObjectFactory.createImageElement("lucky_1", {
      anchor: new Vec4(0.5, 0.4, 0.5, 0.4),
      pivot: new Vec2(0.5, 0.3)
    });
    this.lucky_1.setLocalScale(0.3, 0.3, 0.3)
    this.lucky_1.setLocalEulerAngles(0, 0, 80)
    this.panel.addChild(this.lucky_1)
    let curve = new pc.Curve([
      0, 80,
      0.5, -72,
      1, 80
    ])
    Tween.createCountTween({
      duration: 2,
      loop: true,
      onUpdate: (dt) => {
        let rotZ = curve.value(dt.percent);
        if ((80 >= rotZ && rotZ >= 55) || (-20 > rotZ && rotZ >= -45)) {
          this.claimMoney = this.ernMoney * 2
        }
        else if ((55 > rotZ && rotZ >= 17) || (-45 > rotZ && rotZ >= -72)) {
          this.claimMoney = this.ernMoney * 3
        }
        else if (17 > rotZ && rotZ >= -20) {
          this.claimMoney = this.ernMoney * 5
        }
        this.moneyClaim.element.text = this.claimMoney
        let tmpRot = this.lucky_1.getLocalEulerAngles();
        this.lucky_1.setLocalEulerAngles(tmpRot.x, tmpRot.y, rotZ);
      },
    }).start();
  }
  _initLightBehindItem() {
    this.halo = ObjectFactory.createImageElement("light", {
      anchor: new Vec4(0.8, 0.5, 0.8, 0.5),
    });
    this.unlockItemGroup.addChild(this.halo)

    this.iconSmile = ObjectFactory.createImageElement("cuoi", {
      pivot: new Vec2(0.5, 0.5),
      anchor: new Vec4(0.8, 0.5, 0.8, 0.5),
      width: 158,
      height: 158
    });
    this.unlockItemGroup.addChild(this.iconSmile)

    this.tweenRotate = Tween.createRotateTween(this.halo, {
      x: 0, y: 0, z: 360,
    }, {
      duration: 7,
      loop: true
    }).start();

  }
  _initVictory() {
    this.textVictory = new Entity();
    this.textVictory.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.5, -0.2, 0.5, -0.2),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 45,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("JandaManateeSolid"),
      text: "Victory",
      color: Util.createColor(255, 255, 255),
      outlineThickness: 0,
      outlineColor: Util.createColor(0, 0, 0)
    });
    this.iconSmile.addChild(this.textVictory)
  }
  _initUnlockItem() {
    this.unlockItemGroup = ObjectFactory.createGroupElement({
      anchor: new Vec4(0.5, 0.75, 0.5, 0.75),
    });
    this.addChild(this.unlockItemGroup);

    this._initLightBehindItem()
    this._initVictory()

    this._initGradient();
    this.initTimeOut();

  }

  initTimeOut() {
    this.timeOut = Tween.createCountTween({
      duration: 3,
      onUpdate: (time) => {
        this.radialGradient.element.material.alphaTest = 1 - time.percent;
        this.radialGradient.element.material.update();
      }
    }).start();
  }

  _initGradient() {
    this.itemBlack = ObjectFactory.createImageElement("BurgerItemBacon");
    this.itemBlack.element.color = Util.createColor(0, 0, 0);
    this.itemBlack.element.opacity = 0.75;
    //this.unlockItemGroup.addChild(this.itemBlack);

    this.radialGradient = new Entity();
    this.unlockItemGroup.addChild(this.radialGradient);
    let mat = AssetLoader.getAssetByKey("mat_radial_gradient");
    this.radialGradient.addComponent("element", {
      type: ELEMENTTYPE_IMAGE,
      anchor: new Vec4(0.5, 0.5, 0.5, 0.5),
      pivot: new Vec2(0.5, 0.5),
      materialAsset: mat,
      width: 200,
      height: 200,
      mask: true,
    });
    this.item = ObjectFactory.createImageElement("BurgerItemBacon");
    // /this.radialGradient.addChild(this.item);
  }


  _onTapButtonContinue() {
    this.fire(WinScreenEvent.ButtonContinueClicked);
    this.tweenBtnContinue.stop();
  }
}
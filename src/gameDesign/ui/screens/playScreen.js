import { ELEMENTTYPE_TEXT, Entity, Vec2, Vec3, Vec4 } from "playcanvas";
import { GameConstant } from "../../../gameConstant";
import { UIScreen } from "../../../template/ui/uiScreen"
import { Util } from "../../../helpers/util";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { ObjectFactory } from "../../../template/objects/objectFactory";
import { LoadingPlay } from "../objects/loadingPlay";
import { Game } from "../../../game";
export const PlayScreenEvent = Object.freeze({
  ButtonSettingClicked: "btnSettingClicked",
});
export class PlayScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_PLAY);
    this._initLevelText();
    this._initCurrencyText();
    this._initIncomeText();
    this._initSettingButton()
    this._initLoadingPlay()
    this._initIconLoadingPlay();
  }

  create() {
    super.create();
  }

  _initSettingButton() {
    this.settingBtn = ObjectFactory.createImageElement("setting", {
      anchor: new Vec4(0.05, 0.95, 0.05, 0.95),
      pivot: new Vec2(0.5, 0.5)
    });
    this.settingBtn.setLocalScale(0.1, 0.1, 0.1)
    this.addChild(this.settingBtn)
    Util.registerOnTouch(this.settingBtn.element, () => {
      this.fire(PlayScreenEvent.ButtonSettingClicked);
    });
  }

  _initLoadingPlay() {
    this.loadingPlay = new LoadingPlay();
    this.loadingPlay.start();
    this.addChild(this.loadingPlay);
  }

  _initLevelText() {
    this.levelText = new Entity("levelText");
    this.temp = 0.95
    if (Game.isPortrait()) {
      this.temp = 0.85
    }
    else {
      this.temp = 0.9
    }

    this.levelText.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(this.temp, 0.95, this.temp, 0.95),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 56,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("font_ariston_comic"),
      text: GameConstant.LEVEL_TEXT,
      color: Util.createColor(255, 255, 255),
      outlineThickness: 0.4,
      outlineColor: Util.createColor(1, 1, 1)
    });
    this.addChild(this.levelText);
    this.levelText.setLocalPosition(10, -30, 0);
  }

  _initIncomeText() {
    this.effectEntity = new Entity("effectEntity");
    this.addChild(this.effectEntity);
    this.incomeText = new Entity("incomeText");
    this.incomeText.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.6, 0.5, 0.6, 0.5),
      pivot: new Vec2(0, 0.5),
      fontSize: 96,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("font_ariston_comic"),
      text: "x1.0",
      color: Util.createColor(255, 255, 255),
      outlineThickness: 0.2,
      outlineColor: Util.createColor(0, 0, 0)
    });
    this.effectEntity.addChild(this.incomeText);
    this.incomeText.enabled = false;
  }

  _initCurrencyText() {
    this.bg = ObjectFactory.createImageElement("spr_bg_currency", {
      anchor: new Vec4(1, 1, 1, 1),
      pivot: new Vec2(1, 1),
    });
    this.bg.setLocalPosition(20, -10, 0);
    let icon = ObjectFactory.createImageElement("spr_icon_money", {
      anchor: new Vec4(0, 0.5, 0, 0.5),
      pivot: new Vec2(0, 0.5),
    });
    icon.setLocalScale(0.4, 0.4, 0.4);
    icon.setLocalPosition(10, 0, 0);

    this.currencyText = new Entity("currencyText");
    this.currencyText.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(1, 0.5, 1, 0.5),
      pivot: new Vec2(1, 0.5),
      fontSize: 46,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("font_ariston_comic"),
      text: 0,
      color: Util.createColor(255, 255, 255),
      outlineThickness: 0.2,
      outlineColor: Util.createColor(0, 0, 0)
    });
    this.currencyText.setLocalPosition(-30, 0, 0);
  }

  updateCurrencyText(currency) {
    this.currencyText.element.text = Util.formatCash(currency);
  }

  updateLevelText(level) {
    this.levelText.element.text = GameConstant.LEVEL_TEXT + level;
  }
  _initIconLoadingPlay() {
    this.cryIcon = ObjectFactory.createImageElement("cry", {
      width: 64,
      height: 64,
      anchor: new Vec4(0, 0, 0, 0),
      pivot: new Vec2(0, 0.5),
      x: 50,
    });
    this.smileIcon = ObjectFactory.createImageElement("cuoi", {
      width: 64,
      height: 64,
      anchor: new Vec4(0, 0.5, 0, 0.5),
      pivot: new Vec2(0, 0.5),
      x: 50,
    });
    this.wowIcon = ObjectFactory.createImageElement("ngac-nhien", {
      width: 64,
      height: 64,
      anchor: new Vec4(0, 1, 0, 1),
      pivot: new Vec2(0, 0.5),
      x: 50,
    });
    this.loadingPlay.addChild(this.cryIcon)
    this.loadingPlay.addChild(this.smileIcon)
    this.loadingPlay.addChild(this.wowIcon)
  }

  update() {
    super.update();
    this.loadingPlay.update()
  }

  resize() {
    super.resize();
  }
}

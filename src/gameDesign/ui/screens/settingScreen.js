import { ELEMENTTYPE_TEXT, Vec2, Vec4 } from "playcanvas";
import { GameConstant } from "../../../gameConstant";
import { ObjectFactory } from "../../../template/objects/objectFactory";
import { UIScreen } from "../../../template/ui/uiScreen";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { Util } from "../../../helpers/util";
import { SoundManager } from "../../../soundManager";

export const SettingScreenEvent = Object.freeze({
  Close: "close",
});
export class SettingScreen extends UIScreen{
  constructor() {
    super(GameConstant.SCREEN_SETTING);
    this.screen.priority = 1;
    this._initBg();
    this._initPanel();
    this.settingData = JSON.parse(localStorage?.getItem("settings"));
    if (!this.settingData) {
      this.settingData = {
        music: true,
        sfx: true,
      };
    }

    if(this.settingData.sfx) {
      this.activeSound(true);
    } else {
      this.activeSound(false);
    }

    if(this.settingData.music) {
      this.activeMusic(true);
    } else {
      this.activeMusic(false);
    }
  }

  create() {
    super.create();
  }

  _initBg() { 
    this.bg = ObjectFactory.createColorBackground(0x000000, 0.5);
    this.bg.element.useInput = true;
    this.addChild(this.bg);
  }

  _initPanel() {
    this.panel = ObjectFactory.createImageElement("popup", {
      anchor: new Vec4(0.5, 0.5, 0.5, 0.5),
      pivot: new Vec2(0.5, 0.5)
    });
    this.addChild(this.panel);

    let titleText = new pc.Entity()
    titleText.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.5, 0.8, 0.5, 0.8),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 46,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("JandaManateeSolid"),
      text: "SETTING",
      color: Util.createColor(255, 255, 255),
      outlineThickness: 0.2,
      outlineColor: Util.createColor(0, 0, 0)
    });
    this.panel.addChild(titleText);

    let closeBtn = titleText.clone();
    closeBtn.element.text = "X";
    closeBtn.element.fontSize = 60;
  closeBtn.element.anchor = new Vec4(0.95, 0.95, 0.995, 0.95);
    this.panel.addChild(closeBtn);
    Util.registerOnTouch(closeBtn.element, this.close, this);

    this.soundText = titleText.clone();
    this.soundText.element.text = "Sound";
    this.soundText.element.fontSize = 46;
    this.soundText.element.anchor = new Vec4(0.5, 0.4, 0.5, 0.4);
    this.soundText.element.pivot = new Vec2(0.5, 0.5);
    this.soundText.strikeThrough = ObjectFactory.createImageElement("zyro", {
      width: 140
    });
    this.soundText.strikeThrough.setLocalEulerAngles(0, 0, 14);
    this.soundText.addChild(this.soundText.strikeThrough);
    this.panel.addChild(this.soundText);
    Util.registerOnTouch(this.soundText.element, () => {
      this.activeSound(!this.settingData.sfx);
    });

    this.musicText = titleText.clone();
    this.musicText.element.text = "Music";
    this.musicText.element.fontSize = 46;
    this.musicText.element.anchor = new Vec4(0.5, 0.2, 0.5, 0.2);
    this.musicText.element.pivot = new Vec2(0.5, 0.5);
    this.musicText.strikeThrough = ObjectFactory.createImageElement("zyro", {
      width: 140
    });
    this.musicText.strikeThrough.setLocalEulerAngles(0, 0, 14);
    Util.registerOnTouch(this.musicText.element, () => {
      this.activeMusic(!this.settingData.music);
    });
    this.musicText.addChild(this.musicText.strikeThrough);
    this.panel.addChild(this.musicText);
  }

  activeSound(isActive) {
    this.settingData.sfx = isActive;
    localStorage?.setItem("settings", JSON.stringify(this.settingData));
    this.soundText.strikeThrough.enabled = !this.settingData.sfx;
    SoundManager.muteAllSfx(!this.settingData.sfx);
  }

  activeMusic(isActive) { 
    this.settingData.music = isActive;
    localStorage?.setItem("settings", JSON.stringify(this.settingData));
    this.musicText.strikeThrough.enabled = !this.settingData.music;
    if(this.settingData.music) {
      SoundManager.play("sfx_game_BGM", true);
    } else {
      SoundManager.stop("sfx_game_BGM");
    }
  }

  close() {
    this.fire(SettingScreenEvent.Close);
  }
}
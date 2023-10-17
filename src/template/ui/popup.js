import { GameConstant } from "../../gameConstant";
import { UIScreen } from "./uiScreen"; 
import { ObjectFactory } from "../objects/objectFactory"; 
import { Tween } from "../systems/tween/tween";

import {
  ELEMENTTYPE_IMAGE,
  ELEMENTTYPE_TEXT,
  Entity,
  Vec2,
  Vec3,
  Vec4,
} from "playcanvas";

import { Util } from "../../helpers/util";
import { Game } from "../../game"; 
import { SceneManager } from "../scene/sceneManager"; 

export class PopupScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_POPUP);
    this.screen.priority = 100;
    this._initBg();
    this._initPopup();
    this.resize();
  }

  create() {
    super.create();
  }

  _initBg() {
    this.fakeBg = ObjectFactory.createColorBackground("fakeBg");
    this.addChild(this.fakeBg);
    this.fakeBg.element.opacity = 0.3;
    Util.registerOnTouch(this.fakeBg.element, this.closePopup, this);
  }
  _initPopup() {
    this.popup = ObjectFactory.createImageElement("spr_ads_error", {
      anchor: new Vec4(0.5, 0.7, 0.5, 0.7),
      pivot: new Vec2(0.5, 0.5),
    });
    this.addChild(this.popup);
    this.popup.setLocalScale(0.7, 0.7, 0.7);

    this.xButton = ObjectFactory.createImageElement("x", {
      anchor: new Vec4(0.9, 0.9, 0.9, 0.9),
      pivot: new Vec2(0.5, 0.5),
    });
    this.xButton.setLocalScale(0.7, 0.7, 0.7);
    this.popup.addChild(this.xButton);
    Util.registerOnTouch(this.xButton.element, this.closePopup, this);
  }

  showPopup() {
    this.enabled = true;
    Tween.createCountTween({
      duration:2,
      onUpdate:()=>{}
      ,onComplete:()=>{
        this.closePopup()
      }
    })
  }
  closePopup() {
    this.enabled = false;
  }
  resize() {
    super.resize();
    if (Game.isLandscape()) {
      this.popup.setLocalScale(0.5, 0.5, 0.5);
    }

    if (Game.isPortrait()) {
      this.popup.setLocalScale(0.7, 0.7, 0.7);
    }
  }

  update() {
    super.update();
  }
}
import { Entity } from "playcanvas";
import { Game } from "./game";
import { AssetLoader } from "./assetLoader/assetLoader";
export class SoundManager {
  static initSound(audioAssets) {
    this.soundManagerEntity = new Entity();
    Game.app.root.addChild(this.soundManagerEntity);
    this.soundManager = this.soundManagerEntity.addComponent("sound");
    audioAssets.forEach((asset) => {
      this.addSoundSlot(asset.name);
    });
  }

  static addSoundSlot(soundName) {
    this[soundName] = this.soundManagerEntity.sound.addSlot(soundName, {
      asset: AssetLoader.getAssetByKey(soundName),
      pitch: 1,
      loop: false,
      volume: 1,
      autoPlay: false,
      overlap: true,
    });
  }
  static addSoundSlotLoop(soundName) {
    this[soundName] = this.soundManagerEntity.sound.addSlot(soundName, {
      asset: AssetLoader.getAssetByKey(soundName),
      pitch: 1,
      loop: true,
      volume: 1,
      autoPlay: false,
      overlap: true,
    });
  }

  static play(id, loop = false) {
    this[id].loop = loop;
    this.soundManagerEntity.enabled && this[id].play();
  }

  static pause(id) {
    this[id].pause();
  }

  static resume(id) {
    this[id].resume();
  }

  static stop(id) {
    this[id].stop();
  }

  static muteAllSfx(isMute) {
    let volume = isMute ? 0 : 1;
    // hard code remove sfx_game_BGM
    let slots = this.soundManagerEntity.sound.slots;
    Object.values(slots).forEach((slot) => { 
      if (slot.name !== "sfx_game_BGM") {
        slot.volume = volume;
      }
    });
  }

  static muteAll(isMute) {
    let volume = isMute ? 0 : 1;
    this.soundManager.volume = volume;
  }
}

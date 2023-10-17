import { Entity } from "playcanvas";
import { Debug } from "../debug";
import { UIManager } from "../ui/uiManager";

export class Scene extends Entity {
  constructor(key) {
    super(key);
    this.key = key;
    this.isCreated = false;
    this.ui = new UIManager();
    this.addChild(this.ui);
  }

  create() {
    Debug.log(`${this.key}Scene`, "Create");
    this.isCreated = true;
  }

  update() {
    if (!this.enabled) return;
    this.ui.update();
  }

  resize() {
    if (!this.enabled) return;
    this.ui.resize();
  }

  pause() {
    if (!this.enabled) return;
    this.ui.pause();
  }

  resume() {
    if (!this.enabled) return;
    this.ui.resume();
  }

  hide() {
    this.enabled = false;
  }

  show() {
    this.enabled = true;
  }

  destroy() {
    super.destroy();
  }
}

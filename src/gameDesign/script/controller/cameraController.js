import { Entity, math, Vec3 } from "playcanvas";
import { Util } from "../../../helpers/util";
import { Script } from "../../../template/systems/script/script";
import { Time } from "../../../template/systems/time/time";
import { GameConstant } from "../../../gameConstant";
import { Tween } from "../../../template/systems/tween/tween";
export const cameraEvent = Object.freeze({
  bumpy: "bumpy",
});
export const CameraController = Script.createScript({
  name: "cameraController",

  attributes: {
    target: {},
    speed: { default: 1 },
    offset: { default: new Vec3() },
    limitX: { default: 0 },
    pos: { default: new Vec3() },
  },

  _targetPos: null,
  _tmpPos: null,

  initialize() {
    this._tmpPos = new Vec3();
    this._targetPos = new Vec3();
    this.entity.on(cameraEvent.bumpy, this.bumpyCamera, this)
  },
  bumpyCamera() {
    // let curve = new pc.Curve([
    //   0, this.pos.y,
    //   0.1, this.pos.y + 0.75,
    //   0.2, this.pos.y + 0.25,
    //   0.3, this.pos.y + 0.75,
    //   0.4, this.pos.y + 0.25,
    //   0.5, this.pos.y + 0.75,
    //   0.6, this.pos.y + 0.25,
    //   0.7, this.pos.y + 0.75,
    //   0.8, this.pos.y + 0.25,
    //   0.9, this.pos.y + 0.75,
    //   1, this.pos.y,
    // ]);
    // let distanceJump = 10;
    // let targetPos = this.entity.getPosition().clone().add(new Vec3(0, 0, distanceJump));
    // let distance = targetPos.clone().sub(this.entity.getPosition()).length();
    // let duration = distance / GameConstant.GAME_SPEED;
    // Tween.createCountTween({
    //   duration,
    //   onUpdate: (dt) => {
    //     let pos = curve.value(dt.percent);
    //     let tmpPos = this.entity.getPosition();
    //     this.entity.setPosition(tmpPos.x, pos, tmpPos.z);
    //   },
    //   // onComplete: () => {
    //   //   Tween.createLocalTranslateTween(this.entity, { y: "+0.3" }, {
    //   //     duration: 0.05,
    //   //     repeat: 1,
    //   //     yoyo: true,
    //   //     onComplete: () => {
    //   //       this.state = PlayerState.Move;
    //   //     }
    //   //   }).start();
    //   // }
    // }).start();
  },

  update() {
    if (this.stopFollow) return
    let cameraX = this.target.getPosition().x;
    if (cameraX < -this.limitX || cameraX > this.limitX) {
      cameraX = this.limitX * Util.sign(cameraX);
    }

    let cameraPos = this.entity.getPosition();
    cameraPos.x = math.lerp(cameraPos.x, cameraX + this.offset.x, this.speed * Time.dt);

    this._targetPos.add2(this.target.getPosition(), this.offset);
    this.entity.setPosition(cameraPos.x, this.target.character.getPosition().y + this.offset.y, this._targetPos.z - 3);
  },

  onPlayerDie() {
    this._targetPos.copy(this.target.getPosition());
    let temp = new Entity();
    temp.setPosition(this._targetPos.x, this._targetPos.y, this._targetPos.z + 10);
    this.target = temp;
    this.speed = 0.8;
  },
  CameraUp() {
    this.stopFollow = true
    let curveY = new pc.Curve([
      0, this.pos.y,

      1, this.pos.y * 2,
    ]);
    let curveZ = new pc.Curve([
      0, this.entity.getPosition().z,
      1, this.entity.getPosition().z + 20,
    ]);
    let distanceJump = 10;
    let targetPos = this.entity.getPosition().clone().add(new Vec3(0, 0, distanceJump));
    let distance = targetPos.clone().sub(this.entity.getPosition()).length();
    let duration = distance / GameConstant.GAME_SPEED;
    Tween.createCountTween({
      duration,
      onUpdate: (dt) => {
        let posY = curveY.value(dt.percent);
        let tmpPos = this.entity.getPosition();
        this.entity.setPosition(tmpPos.x, posY, tmpPos.z);
      },
    }).start();
    Tween.createCountTween({
      duration: 3,
      onUpdate: (dt) => {
        let posZ = curveZ.value(dt.percent);
        let tmpPos = this.entity.getPosition();
        this.entity.setPosition(tmpPos.x, tmpPos.y, posZ);
      },
    }).start();
    // onComplete: () => {
    //   Tween.createLocalTranslateTween(this.entity, { y: "+0.3" }, {
    //     duration: 0.05,
    //     repeat: 1,
    //     yoyo: true,
    //     onComplete: () => {
    //       this.state = PlayerState.Move;
    //     }
    //   }).start();
    // }

  },
  CameraUpAndGo() {
    this.stopFollow = true
    let curveY = new pc.Curve([
      0, this.pos.y,

      1, this.pos.y * 2,
    ]);
    let curveZ = new pc.Curve([
      0, this.entity.getPosition().z,
      1, this.entity.parent.player.character.abs[this.entity.parent.player.character.abs.length - 1].getPosition().z - 5,
    ]);
    let distanceJump = 10;
    let targetPos = this.entity.getPosition().clone().add(new Vec3(0, 0, distanceJump));
    let distance = targetPos.clone().sub(this.entity.getPosition()).length();
    let duration = distance / GameConstant.GAME_SPEED;
    Tween.createCountTween({
      duration,
      onUpdate: (dt) => {
        let posY = curveY.value(dt.percent);
        let tmpPos = this.entity.getPosition();
        this.entity.setPosition(tmpPos.x, posY, tmpPos.z);
      },
    }).start();
    Tween.createCountTween({
      duration: 3,
      onUpdate: (dt) => {
        let posZ = curveZ.value(dt.percent);
        let tmpPos = this.entity.getPosition();
        this.entity.setPosition(tmpPos.x, tmpPos.y, posZ);
      },
    }).start();
  },
  cameraUpHill() {
    // let cameraPos = this.entity.getPosition();

    // let curveY = new pc.Curve([
    //   0, cameraPos.y,

    //   1, cameraPos.y + 3,
    // ]);

    // Tween.createCountTween({
    //   duration: 1,
    //   onUpdate: (dt) => {
    //     let posY = curveY.value(dt.percent);
    //     let tmpPos = this.entity.getPosition();
    //     this.entity.setPosition(tmpPos.x, posY, tmpPos.z);
    //   },
    // }).start();
  }
});

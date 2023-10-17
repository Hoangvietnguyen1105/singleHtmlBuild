import { Curve, Entity } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { BoxCollider } from "../../../../physics/scripts/boxCollider";
import { GameConstant } from "../../../../gameConstant";
import { CollisionTag } from "../../../../physics/collisionTag";
import { SpawningEvent } from "../../../script/spawners/spawningEvent";

export class Jump extends Entity {
  constructor() {
    super();
    this.addComponent("model", { asset: AssetLoader.getAssetByKey("model_jump") });
    this.completeTweenJump = true
    this.collider = this.addScript(BoxCollider, {
      tag: CollisionTag.Jump,
      position: new pc.Vec3(0, 0.5, 0),
      scale: new pc.Vec3(1.4, 1, 1),
      render: GameConstant.DEBUG_COLLIDER
    });
    this.on(SpawningEvent.Spawn, () => {
      this.collider && this.collider.enable();
    });
    this.curve = new Curve([
      0, 0,
      1, 30,
    ]);
  }

  config(data) {
    let pos = data.pos;
    let rot = data.rot;
    let scale = data.scale;
    this.setPosition(pos.x, pos.y, pos.z);
    this.setEulerAngles(rot.x, rot.y, rot.z);
    this.setLocalScale(scale.x, scale.y, scale.z);
    this.distanceJump = data.distanceJump;
  }

  onCollide() {
    // this.collider && this.collider.disable();
  }
}
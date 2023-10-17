import { Entity, Vec3 } from "playcanvas";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { BoxCollider } from "../../../physics/scripts/boxCollider";
import { CollisionTag } from "../../../physics/collisionTag";
import { GameConstant } from "../../../gameConstant";
import { SpawningEvent } from "../../script/spawners/spawningEvent";
import { BlockAreaManager } from "../blockArea/blockAreaManager";
import { physics_ammo } from "../../../physics-ammo/setPhysics";
export class Road extends Entity {
  constructor() {
    super("road");
    this.road = this.addComponent("model", { asset: AssetLoader.getAssetByKey("Straight") });
    this.collider = this.addScript(BoxCollider, {
      tag: CollisionTag.Road,
      render: GameConstant.DEBUG_COLLIDER,
      position: new Vec3(0, 0, 0),
      scale: new Vec3(1, 1, 1),
    });
    this.on(SpawningEvent.Spawn, () => {
      this.collider.enable();
      this.collider.respawn();
      BlockAreaManager.instance.addRoadBlockArea(this.collider);
    });
    this.setPhysics();
  }

  config(data) {
    let pos = data.pos;
    let rot = data.rot;
    let scale = data.scale;
    this.setLocalPosition(pos.x, pos.y, pos.z);
    this.setLocalEulerAngles(rot.x, rot.y, rot.z);
    this.setLocalScale(scale.x, scale.y, scale.z);
  }
  setPhysics() {
    this.addComponent("collision", {
      type: "mesh",
      asset: AssetLoader.getAssetByKey("Straight"),

    });
    this.addComponent("rigidbody", {
      type: "static",
      mass: 50,
      restitution: 0.5,
      friction: 0.5,
    });
  }
}
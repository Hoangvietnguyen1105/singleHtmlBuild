import { Entity, Vec3 } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { BoxCollider } from "../../../../physics/scripts/boxCollider";
import { CollisionTag } from "../../../../physics/collisionTag";
import { GameConstant } from "../../../../gameConstant";
import { SpawningEvent } from "../../../script/spawners/spawningEvent";
import { BlockAreaManager } from "../../blockArea/blockAreaManager";
export class Candy4 extends Entity {
    constructor() {
        super("Chesse");
        this.Chesse = this.addComponent("model", { asset: AssetLoader.getAssetByKey("Candy4") });
        this.collider = this.addScript(BoxCollider, {
            tag: CollisionTag.item,
            render: GameConstant.DEBUG_COLLIDER,
            position: new Vec3(0, 0, 0),
            scale: new Vec3(1, 1, 1),
        });
        this.on(SpawningEvent.Spawn, () => {
            this.collider.enable();
            this.collider.respawn();
            BlockAreaManager.instance.addRoadBlockArea(this.collider);
        });
        this.itemValue = "itemCandy4"

    }

    config(data) {
        let pos = data.pos;
        let rot = data.rot;
        let scale = data.scale;
        this.setLocalPosition(pos.x, pos.y, pos.z);
        this.setLocalEulerAngles(rot.x, rot.y, rot.z);
        this.setLocalScale(scale.x, scale.y, scale.z);
    }
    onCollide() {
        // this.collider && this.collider.disable();
        // this.fire(SpawningEvent.Despawn);
    }
}
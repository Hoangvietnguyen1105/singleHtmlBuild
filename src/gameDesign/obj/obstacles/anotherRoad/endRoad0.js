import { Entity, Vec3 } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { BoxCollider } from "../../../../physics/scripts/boxCollider";
import { CollisionTag } from "../../../../physics/collisionTag";
import { GameConstant } from "../../../../gameConstant";
import { SpawningEvent } from "../../../script/spawners/spawningEvent";
import { BlockAreaManager } from "../../blockArea/blockAreaManager";
export class endRoad0 extends Entity {
    constructor() {
        super("endRoad");
        this.addComponent("model", { asset: AssetLoader.getAssetByKey("Road_base") });


    }

    config(data) {
        let pos = data.pos;
        let rot = data.rot;
        let scale = data.scale;
        this.setLocalPosition(pos.x, pos.y, pos.z);
        this.setLocalEulerAngles(rot.x, rot.y, rot.z);
        this.setLocalScale(scale.x, scale.y, scale.z);

        this.curve = new pc.Curve([
            0, pos.y + 0.25,
            0.5, pos.y + 3,
            1, pos.y - 2,
        ]);
    }
    onCollide() {
        this.collider && this.collider.disable();
        //this.fire(SpawningEvent.Despawn);
    }

}
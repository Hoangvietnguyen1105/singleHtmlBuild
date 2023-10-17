import { Entity, Vec3 } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { BoxCollider } from "../../../../physics/scripts/boxCollider";
import { CollisionTag } from "../../../../physics/collisionTag";
import { GameConstant } from "../../../../gameConstant";
import { SpawningEvent } from "../../../script/spawners/spawningEvent";
import { BlockAreaManager } from "../../blockArea/blockAreaManager";
import { ObjectFactory } from "../../../../template/objects/objectFactory";
import { Tween } from "../../../../template/systems/tween/tween";
import { gianMove } from "../../../script/controller/gianMove";
export class gian extends Entity {
    constructor() {
        super("gian");

        this.addComponent("model", { asset: AssetLoader.getAssetByKey("gian") });
        this.move = this.addScript(gianMove, {
        });

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
        //this.collider && this.collider.disable();
        //  this.fire(SpawningEvent.Despawn);
    }
}
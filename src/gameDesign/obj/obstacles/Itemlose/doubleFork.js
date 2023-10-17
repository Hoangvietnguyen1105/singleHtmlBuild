import { Entity, Vec3 } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { BoxCollider } from "../../../../physics/scripts/boxCollider";
import { CollisionTag } from "../../../../physics/collisionTag";
import { GameConstant } from "../../../../gameConstant";
import { SpawningEvent } from "../../../script/spawners/spawningEvent";
import { BlockAreaManager } from "../../blockArea/blockAreaManager";
import { ObjectFactory } from "../../../../template/objects/objectFactory";
export class DoubleFork extends Entity {
    constructor() {
        super("DoubleFork");
        this.DoubleFork = this.addComponent("model", { asset: AssetLoader.getAssetByKey("DoubleFork") });
        this.runConfig()
    }

    config(data) {
        let pos = data.pos;
        let rot = data.rot;
        let scale = data.scale;
        this.setLocalPosition(pos.x, pos.y, pos.z);
        this.setLocalEulerAngles(rot.x, rot.y, rot.z);
        this.setLocalScale(scale.x, scale.y, scale.z);
        this.curveY = new pc.Curve(
            [
                0, pos.y + 0.25,
                0.5, pos.y + 1.5,
                1, pos.y + 3,
            ]
        )
        this.curveX = new pc.Curve(
            [
                0, pos.x,
                0.5, pos.x - 2,
                1, pos.x - 4,
            ]
        )

    }
    runConfig() {
        this.config(
            {
                pos: new pc.Vec3(0, 1, 0),
                rot: new pc.Vec3(0, 90, 30),
                scale: new pc.Vec3(1, 1, 1)
            }
        )
    }

    onCollide() {
        //this.collider && this.collider.disable();
        //  this.fire(SpawningEvent.Despawn);
    }
}
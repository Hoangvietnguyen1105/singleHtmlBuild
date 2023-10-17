import { Entity, Vec3 } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { BoxCollider } from "../../../../physics/scripts/boxCollider";
import { CollisionTag } from "../../../../physics/collisionTag";
import { GameConstant } from "../../../../gameConstant";
import { SpawningEvent } from "../../../script/spawners/spawningEvent";
import { BlockAreaManager } from "../../blockArea/blockAreaManager";
export class DoorDecor extends Entity {
    constructor() {
        super("DoorDecor");
        this.DoorDecor = this.addComponent("model", { asset: AssetLoader.getAssetByKey("DoorDecor") });
        this.collider = this.addScript(BoxCollider, {
            tag: CollisionTag.item,
            render: GameConstant.DEBUG_COLLIDER,
            position: new Vec3(0, 0, 0),
            scale: new Vec3(3.5, 1, 1),
        });
        this.on(SpawningEvent.Spawn, () => {
            this.collider.enable();
            this.collider.respawn();
            BlockAreaManager.instance.addRoadBlockArea(this.collider);
        });
        let gangsterEntity = new pc.Entity()
        let gangster =  gangsterEntity.addComponent("model", { asset: AssetLoader.getAssetByKey("3_Gangster") });
        gangsterEntity.setLocalPosition(0,7,0)
        this.addChild(gangsterEntity)
        this.itemValue = "gangster"

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
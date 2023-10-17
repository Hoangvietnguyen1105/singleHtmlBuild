import { Entity, Vec3 } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { BoxCollider } from "../../../../physics/scripts/boxCollider";
import { CollisionTag } from "../../../../physics/collisionTag";
import { GameConstant } from "../../../../gameConstant";
import { SpawningEvent } from "../../../script/spawners/spawningEvent";
import { BlockAreaManager } from "../../blockArea/blockAreaManager";
export class JumpState2 extends Entity {
    constructor() {
        super("JumpState");
        this.jumpState2 = this.addComponent("model", { asset: AssetLoader.getAssetByKey("JumpState2") });
        this.collider = this.addScript(BoxCollider, {
            tag: CollisionTag.Jump,
            render: GameConstant.DEBUG_COLLIDER,
            position: new Vec3(0, -1, -3),
            scale: new Vec3(9, 1, 3),
        });
        this.on(SpawningEvent.Spawn, () => {
            this.collider.enable();
            this.collider.respawn();
            BlockAreaManager.instance.addRoadBlockArea(this.collider);
        });
        // disable mesh 1 intace of jumpstate2
        // this.jumpState2.model.meshInstances[2].enabled = false;


    }

    config(data) {
        let pos = data.pos;
        let rot = data.rot;
        let scale = data.scale;
        this.setLocalPosition(pos.x, pos.y, pos.z);
        this.setLocalEulerAngles(rot.x, rot.y, rot.z);
        this.setLocalScale(scale.x, scale.y, scale.z);
        this.curve = new pc.Curve([
            0, pos.y - 1.1,
            // 0.05, 1,
            // 0.1, 1.417,
            // 0.15, 1.817,
            // 0.2, 2.3,
            // 0.25, 2.7,
            // 0.3, 3.023,
            // 0.35, 3.223,
            // 0.4, 3.354,
            // 0.45, 3.454,
            0.5, pos.y - 0.85 + 3.25,
            // 0.55, 3.446,
            // 0.6, 3.354,
            // 0.65, 3.254,
            // 0.7, 3.023,
            // 0.75, 2.7,
            // 0.8, 2.3,
            // 0.85, 1.817,
            // 0.9, 1.417,
            // 0.95, 1,
            1, pos.y - 1.1,
        ]);
    }
    onCollide() {
        // this.collider && this.collider.disable();
    }
}
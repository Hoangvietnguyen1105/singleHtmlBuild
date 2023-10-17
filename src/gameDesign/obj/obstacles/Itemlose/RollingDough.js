import { Entity, Vec3 } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { BoxCollider } from "../../../../physics/scripts/boxCollider";
import { CollisionTag } from "../../../../physics/collisionTag";
import { GameConstant } from "../../../../gameConstant";
import { SpawningEvent } from "../../../script/spawners/spawningEvent";
import { BlockAreaManager } from "../../blockArea/blockAreaManager";
import { ObjectFactory } from "../../../../template/objects/objectFactory";
import { flame } from "../../effect/fire";
export class RollingDough extends Entity {
    constructor() {
        super("RollingDough");
        this.RollingDough = this.addComponent("model", { asset: AssetLoader.getAssetByKey("RollingDough") });


        this.on(SpawningEvent.Spawn, () => {
            this.collider.enable();
            this.collider.respawn();
            BlockAreaManager.instance.addRoadBlockArea(this.collider);
        });
this.collider = this.addScript(BoxCollider, {
            tag: CollisionTag.hammer,
            render: GameConstant.DEBUG_COLLIDER,
            position: new Vec3(0, 0, 0),
            scale: new Vec3(5, 10, 1),
        });
        this.show = new Entity()
        this.addChild(this.show)

         
        this.collider = this.show.addScript(BoxCollider, {
            tag: CollisionTag.RollingDough,
            render: GameConstant.DEBUG_COLLIDER,
            position: new Vec3(0, -10, -80),
            scale: new Vec3(20, 10, 1),
        });
     
     
       
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

    onCollide() {
        //this.collider && this.collider.disable();
        //  this.fire(SpawningEvent.Despawn);
    }
}
import { Entity, Vec3 } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { BoxCollider } from "../../../../physics/scripts/boxCollider";
import { CollisionTag } from "../../../../physics/collisionTag";
import { GameConstant } from "../../../../gameConstant";
import { SpawningEvent } from "../../../script/spawners/spawningEvent";
import { BlockAreaManager } from "../../blockArea/blockAreaManager";
import { ObjectFactory } from "../../../../template/objects/objectFactory";
import { flame } from "../../effect/fire";
export class Hob extends Entity {
    constructor() {
        super("Hob");
        this.Hob = this.addComponent("model", { asset: AssetLoader.getAssetByKey("Hob") });


        // TODO: test hand take burger
        // this.palm = this.findByName("mixamorig:LeftHandMiddle1");
        // // let burger = ObjectFactory.createModel("BurgerTop");
        // burger.setLocalScale(200, 200, 200);
        // this.palm.addChild(burger);
        this.on(SpawningEvent.Spawn, () => {
            this.collider.enable();
            this.collider.respawn();
            BlockAreaManager.instance.addRoadBlockArea(this.collider);
        });
        // this.addComponent("animation", {
        //     assets: [
        //         AssetLoader.getAssetByKey("Action"),
        //     ],
        //     loop: true,
        //     activate: true, // Đặt activate là true để animation tự động chạy
        // });
        this.flame = new flame()
        this.flame.setLocalPosition(2.5, -0.5, -1)
        this.addChild(this.flame)
        this.flame2 = new flame()
        this.flame2.setLocalPosition(-2.5, -0.5, -1)
        this.addChild(this.flame2)
        this.collider2 = this.flame.addScript(BoxCollider, {
            tag: CollisionTag.hob,
            render: GameConstant.DEBUG_COLLIDER,
            position: new Vec3(0, 1, 0),
            scale: new Vec3(2, 2, 1),
        });
        this.collider = this.flame2.addScript(BoxCollider, {
            tag: CollisionTag.hob,
            render: GameConstant.DEBUG_COLLIDER,
            position: new Vec3(0, 1, 0),
            scale: new Vec3(2, 2, 1),
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
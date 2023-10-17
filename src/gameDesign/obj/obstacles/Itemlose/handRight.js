import { Entity, Vec3 } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { BoxCollider } from "../../../../physics/scripts/boxCollider";
import { CollisionTag } from "../../../../physics/collisionTag";
import { GameConstant } from "../../../../gameConstant";
import { SpawningEvent } from "../../../script/spawners/spawningEvent";
import { BlockAreaManager } from "../../blockArea/blockAreaManager";
import { ObjectFactory } from "../../../../template/objects/objectFactory";
export class HandRight extends Entity {
    constructor() {
        super("HandRight");
        this.HandLeft = this.addComponent("model", { asset: AssetLoader.getAssetByKey("hand_right") });
        this.collider = this.addScript(BoxCollider, {
            tag: CollisionTag.hand_left,
            render: GameConstant.DEBUG_COLLIDER,
            position: new Vec3(0.2, 1, 0),
            scale: new Vec3(2.5, 2, 1),
        });
        // TODO: test hand take burger

        this.palm = this.findByName("mixamorig:LeftHandMiddle1");
        // let burger = ObjectFactory.createModel("BurgerTop");
        // burger.setLocalScale(200, 200, 200);
        // this.palm.addChild(burger);
        this.on(SpawningEvent.Spawn, () => {
            this.collider.enable();
            this.collider.respawn();
            BlockAreaManager.instance.addRoadBlockArea(this.collider);
        });
        this.addComponent("animation", {
            assets: [
                AssetLoader.getAssetByKey("handStay"),
                AssetLoader.getAssetByKey("HandTrap"),
            ],
            loop: true,
            activate: true, // Đặt activate là true để animation tự động chạy
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
    wavingHand() {
        this.animation.speed = 1;
        this.animation.loop = true;
        this.animation.play("handStay");
    }
    trapHand() {
        this.animation.speed = 1;
        this.animation.loop = false;
        this.animation.play("HandTrap");
    }
    onCollide() {
        this.collider && this.collider.disable();
        //  this.fire(SpawningEvent.Despawn);
    }
}
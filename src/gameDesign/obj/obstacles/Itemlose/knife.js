import { Entity, Vec3 } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { BoxCollider } from "../../../../physics/scripts/boxCollider";
import { CollisionTag } from "../../../../physics/collisionTag";
import { GameConstant } from "../../../../gameConstant";
import { SpawningEvent } from "../../../script/spawners/spawningEvent";
import { BlockAreaManager } from "../../blockArea/blockAreaManager";
import { ObjectFactory } from "../../../../template/objects/objectFactory";
import { Tween } from "../../../../template/systems/tween/tween";
export class Knife extends Entity {
    constructor() {
        super("knife");

        this.knife = new Entity()
        this.knife.addComponent("model", { asset: AssetLoader.getAssetByKey("knife") });

        this.collider = this.addScript(BoxCollider, {
            tag: CollisionTag.knife,
            render: GameConstant.DEBUG_COLLIDER,
            position: new Vec3(-5, 0, 0),
            scale: new Vec3(6, 1, 1),
        });
        this.addChild(this.knife)
        this.knife.setLocalPosition(-2.5, 0, 0)
        // let burger = ObjectFactory.createModel("BurgerTop");
        // burger.setLocalScale(200, 200, 200);
        // this.palm.addChild(burger);

        this.on(SpawningEvent.Spawn, () => {
            this.collider.enable();
            this.collider.respawn();
            BlockAreaManager.instance.addRoadBlockArea(this.collider);
        });
        let curve = new pc.Curve([
            0, 0,
            0.6, -75,
            0.8, 0,
            1, 0
        ])
        Tween.createCountTween({
            duration: 1,
            loop: true,
            onUpdate: (dt) => {
                let rotZ = curve.value(dt.percent);
                let tmpRot = this.getLocalEulerAngles();
                this.setLocalEulerAngles(tmpRot.x, tmpRot.y, rotZ);
            },
        }).start();

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
import { Entity, Vec3 } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { BoxCollider } from "../../../../physics/scripts/boxCollider";
import { CollisionTag } from "../../../../physics/collisionTag";
import { GameConstant } from "../../../../gameConstant";
import { SpawningEvent } from "../../../script/spawners/spawningEvent";
import { BlockAreaManager } from "../../blockArea/blockAreaManager";
import { ObjectFactory } from "../../../../template/objects/objectFactory";
import { Tween } from "../../../../template/systems/tween/tween";
export class Hammer extends Entity {
    constructor() {
        super("Hammer");

        this.Hammer = new Entity()
        this.Hammer.addComponent("model", { asset: AssetLoader.getAssetByKey("polySurface3") });

        this.collider = this.addScript(BoxCollider, {
            tag: CollisionTag.hammer,
            render: GameConstant.DEBUG_COLLIDER,
            position: new Vec3(0, 5, 0),
            scale: new Vec3(6, 2, 2),
        });
        this.addChild(this.Hammer)
        this.Hammer.setLocalPosition(0, 2, 0)
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
            0.2, -75,
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
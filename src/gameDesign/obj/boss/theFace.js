import { Entity, Vec3 } from "playcanvas";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { BoxCollider } from "../../../physics/scripts/boxCollider";
import { CollisionTag } from "../../../physics/collisionTag";
import { GameConstant } from "../../../gameConstant";
import { SpawningEvent } from "../../script/spawners/spawningEvent";
import { BlockAreaManager } from "../blockArea/blockAreaManager";
export class TheFace extends Entity {
    constructor() {
        super("theface");
        this.theFace = this.addComponent("model", { asset: AssetLoader.getAssetByKey("TheFace") });
        this.collider = this.addScript(BoxCollider, {
            tag: CollisionTag.the_face,
            render: GameConstant.DEBUG_COLLIDER,
            position: new Vec3(0, -1, -4),
            scale: new Vec3(7.425, 10, 5.13),
        });
        this.on(SpawningEvent.Spawn, () => {
            this.collider.enable();
            this.collider.respawn();
            BlockAreaManager.instance.addRoadBlockArea(this.collider);
        });
        this.addComponent("animation", {
            assets: [
                AssetLoader.getAssetByKey("theFace@Mouth"),
                AssetLoader.getAssetByKey("theFace@Eat"),
                AssetLoader.getAssetByKey("theFace@Sad"),
                AssetLoader.getAssetByKey("theFace@Smile")
            ],

            activate: true, // Đặt activate là true để animation tự động chạy
        });
        // this.mouth();
        // setTimeout(() => {
        //     this.eat()
        // }, 5000);

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
        this.collider && this.collider.disable();
        this.fire(SpawningEvent.Despawn);
    }
    eat() {
        this.animation.speed = 1;
        this.animation.loop = true;
        this.animation.play("theFace@Eat");
    }
    sad() {
        this.animation.speed = 1;
        this.animation.loop = true;
        this.animation.play("theFace@Sad");
    }
    smile() {
        this.animation.speed = 1;
        this.animation.loop = true;
        this.animation.play("theFace@Smile");
    }
    mouth() {
        this.animation.speed = 1;
        this.animation.loop = true;
        this.animation.play("theFace@Mouth");
    }
}
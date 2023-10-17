import { Entity, Vec3 } from "playcanvas";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { BoxCollider } from "../../../physics/scripts/boxCollider";
import { CollisionTag } from "../../../physics/collisionTag";
import { GameConstant } from "../../../gameConstant";
import { SpawningEvent } from "../../script/spawners/spawningEvent";
import { BlockAreaManager } from "../blockArea/blockAreaManager";
export class Man extends Entity {
    constructor() {
        super("theface");
        this.theFace = this.addComponent("model", { asset: AssetLoader.getAssetByKey("Man_1") });
        this.collider = this.addScript(BoxCollider, {
            tag: CollisionTag.man,
            render: GameConstant.DEBUG_COLLIDER,
            position: new Vec3(0, 1, 0),
            scale: new Vec3(1.8, 1.8, 1.8),
        });
        this.on(SpawningEvent.Spawn, () => {
            this.collider.enable();
            this.collider.respawn();
            BlockAreaManager.instance.addRoadBlockArea(this.collider);
        });
        this.addComponent("animation", {
            assets: [
                AssetLoader.getAssetByKey("man@stand"),
                AssetLoader.getAssetByKey("man@eat"),
                AssetLoader.getAssetByKey("manSad"),

            ],

            activate: true, // Đặt activate là true để animation tự động chạy
        });
        this.onEat = false
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
        // this.fire(SpawningEvent.Despawn);
    }
    eat() {
        this.animation.speed = 1;
        this.animation.loop = true;
        this.animation.play("man@eat");
    }
    stand() {
        this.animation.speed = 1;
        this.animation.loop = true;
        this.animation.play("man@stand");
    }
    sad() {
        this.animation.speed = 1;
        this.animation.loop = true;
        this.animation.play("manSad");
    }

}
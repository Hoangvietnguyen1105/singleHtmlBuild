import { ObjectFactory } from "../../../template/objects/objectFactory"
import { Move } from "../../script/components/move";
import { Entity } from "playcanvas";
import { GameConstant } from "../../../gameConstant";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { Vec3 } from "playcanvas";
import { CharacterFactory } from "../obstacles/characters/characterFactory";
import { BoxCollider } from "../../../physics/scripts/boxCollider";
import { CollisionTag } from "../../../physics/collisionTag";
import { SpawningEvent } from "../../script/spawners/spawningEvent";
import { Tween } from "../../../template/systems/tween/tween";
// import { ObjLoader } from "../../../assetLoader/objLoader";
export class Player extends pc.Entity {
    constructor(ran) {
        super()
        this.ran = ran
        this._initRays();
        this.character = new CharacterFactory(this.ran);
        this.addChild(this.character);
        this.move = this.addScript(Move, {
            speed: new pc.Vec3(0, 0, GameConstant.GAME_SPEED),
        });
        //create number 
        if(ran === 1){
        this.character.config({
            value: GameConstant.PLAYER_MODEL, //number start value when render
            pos: { x: 0, y: 0, z: 0 }, //position of number
            rot: { x: 0, y: 0, z: 0 }, //rotation of number
            scale: { x: 1, y: 1, z: 1 } //scale of number
        });

        }
        if(ran === 2){
            this.character.config({
            value: "CakeBot-CakeTop", //number start value when render
            pos: { x: 0, y: 0, z: 0 }, //position of number
            rot: { x: 0, y: 0, z: 0 }, //rotation of number
            scale: { x: 1, y: 1, z: 1 } //scale of number
        });
        }
        
        this.move.disable();
        this.character.enabled = true;
        this.stringValue = ""
        this.ignoreColission = null
        // this.setPhyspics();
        this.once(SpawningEvent.Despawn, () => this.despawn());
        // add mouse event
        // array of item take into game
        this.items = []
        this.anotherB = []
        this.itemPoints = 0
    }
    _initRays() {
        this.debugRayEntity = new Entity();
        this.debugRayEntity.setLocalScale(0.1, 0.1, 0.1);
        this.addChild(this.debugRayEntity);
        if (GameConstant.DEBUG_RAY) {
            let mat = new pc.StandardMaterial();
            mat.diffuse.set(1, 0, 0);
            this.debugRayEntity.addComponent("model", {
                type: "sphere",
            });
            this.debugRayEntity.model.material = mat;
        }
    }
    setDebugRay(direction) {
        let scale = 1.9;
        let x = 0.2 * 1.5 * direction * scale;
        this.debugRayEntity.setLocalPosition(x, 0.5, 0);
    }
    setPhysics() {
        this.addComponent("collision", {
            type: "box",
            halfExtents: new pc.Vec3(3, 3, 3), // Kích thước của vùng va chạm thu nhỏ
        });
        this.addComponent("rigidbody", {
            type: "dynamic",
            mass: 50,
            restitution: 0.5,
        });
    }
    despawn() {
        this.enabled = false;
        this.parent.removeChild(this);
    }
    onStart() {
        this.controller.onStart()

    }
    reset() {
                this.itemPoints = 0

        this.character.reset()
        // this.controller.reset();
        // this.collider.enable();
        this.character.fire(SpawningEvent.Spawn)
        this.anotherB = []
        this.items = []
    }

}   
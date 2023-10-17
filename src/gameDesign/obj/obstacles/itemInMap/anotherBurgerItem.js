import { Spawner } from "../../../script/spawners/spawner";
import { Character } from "../characters/characters";
import { Entity } from "playcanvas";
import { SpawningEvent } from "../../../script/spawners/spawningEvent";
import { BoxCollider } from "../../../../physics/scripts/boxCollider";
import { CollisionTag } from "../../../../physics/collisionTag";
import { GameConstant } from "../../../../gameConstant";
import { Util } from "../../../../helpers/util";
import { Move } from "../../../script/components/move";
import { folowPrev } from "../../../script/controller/folowPrev";
export class anotherBurgerItem extends Entity {
    constructor() {
        super();
        this._initSpawner();
        this.on(SpawningEvent.Spawn, () => {
            this.value = 0;
            this.elements.forEach((element) => {
                element.fire(SpawningEvent.Despawn);
            });
            this.elements = [];
            this.collider && this.collider.enable();

        });
        this.elements = [];


    }

    config(data) {
        this.value = data.value;
        let valueString = this.value.split("-");
        for (let i = 0; i < valueString.length; i++) {
            var element = valueString[i];
            let character = this.createCharacter(element);
            this.addChild(character);
        }
        this.updateSize(valueString);
    }
    config2(data) {
        let pos = data.pos;
        let rot = data.rot;
        let scale = data.scale;
        this.setLocalPosition(pos.x, pos.y, pos.z);
        this.setLocalEulerAngles(rot.x, rot.y, rot.z);
        this.setLocalScale(scale.x, scale.y, scale.z);
        if (!this.elements[0].script) {
            this.collider = this.elements[0].addScript(BoxCollider, {
                tag: CollisionTag.itemBurger,
                render: GameConstant.DEBUG_COLLIDER,
                position: new pc.Vec3(0, 0, 0),
                scale: new pc.Vec3(1.5, 1, 1.5),
            });
        }

    }
    _initSpawner() {
        // create each number to render
        let cakeCandyTop = new Entity("burgerTopSpawner");
        this.addChild(cakeCandyTop);
        this.cakeCandyTopSpawner = cakeCandyTop.addScript(Spawner, {
            class: Character,
            poolSize: 1,
            args: ["Cake_Candy_Top"]
        });
        this.cakeCandyTopSpawner.initialize();
        this.cakeCandyTopSpawner.postInitialize();

        let cakeCandyBot = new Entity("burgerTopSpawner");
        this.addChild(cakeCandyBot);
        this.cakeCandyBotSpawner = cakeCandyBot.addScript(Spawner, {
            class: Character,
            poolSize: 1,
            args: ["Cake_Candy_Botton"]
        });
        this.cakeCandyBotSpawner.initialize();
        this.cakeCandyBotSpawner.postInitialize();
        let burgerTopSpawnerEntity = new Entity("burgerTopSpawner");
        this.addChild(burgerTopSpawnerEntity);
        this.burgerTopSpawner = burgerTopSpawnerEntity.addScript(Spawner, {
            class: Character,
            poolSize: 1,
            args: ["BurgerTop"]
        });
        this.burgerTopSpawner.initialize();
        this.burgerTopSpawner.postInitialize();

        let burgerBotSpawnerEntity = new Entity("burgerBotSpawner");
        this.addChild(burgerBotSpawnerEntity);
        this.burgerBotSpawner = burgerBotSpawnerEntity.addScript(Spawner, {
            class: Character,
            poolSize: 1,
            args: ["BurgerBot"]
        });
        this.burgerBotSpawner.initialize();
        this.burgerBotSpawner.postInitialize();


    }
    createCharacter(value) {
        let spawner = this.getSpawner(value);
        let character = spawner.spawn();
        this.elements.push(character);
        return character;
    }

    getSpawner(value) {
        switch (value) {
            case "BurgerTop":
                return this.burgerTopSpawner;
            case "CakeTop":
                return this.cakeCandyTopSpawner;
            case "BurgerBot":
                return this.burgerBotSpawner;
            case "CakeBot":
                return this.cakeCandyBotSpawner;
            default:
                return null;
        }
    }
    updateMaterial(material) {
        for (let i = 0; i < this.elements.length; i++) {
            var element = this.elements[i];
            element.updateMaterial(material);
        }
    }
    updateSize(valueString) {

        let scale = 1;
        this.elements.forEach((element, index) => {
            element.setLocalScale(scale, scale, scale);
            if (element.name === "BurgerTop" || element.name ==="Cake_Candy_Top") {
                // có 2 khoảng RANGE_BURGER_MEAT ở khoảng burgerBot và top
                var temp = GameConstant.RANGE_BURGER_MEAT * 2
                if (this.elements.length === 2) {
                    // ban đầu có 2 phần tử burgerBot và burgerTop thì cách ra như sau 
                    temp = GameConstant.RANGE_BURGERTOP_BURGERBOT
                    if(element.name ==="Cake_Candy_Top"){
                        temp /= 2
                    }
                }
                element.setLocalPosition(element.getLocalPosition().x, (index - 1) * GameConstant.RANGE_MEAT_MEAT + temp,element.getLocalPosition().z);  //bằng vị trí của miếng thịt phía trước cộng với khoảng cách 
            }
            else if (index > 0 && element.name !== "BurgerTop") {
                element.setLocalScale(scale, scale, scale);

                // rotation cac mieng thit theo cac huong ngau nhien
                if (!element.rotationY) {
                    element.rotationY = Util.getRandomValue()
                }
                // Khoảng cách giữa các miếng thịt và + thêm khoảng RANGE_BURGER_MEAT do miếng thịt đầu tiên cộng thêm khoảng này 
                element.setLocalPosition(0, index * GameConstant.RANGE_MEAT_MEAT + GameConstant.RANGE_BURGER_MEAT, 0);
                element.setLocalEulerAngles(0, element.rotationY, 0);
            }
        });

    }


    onCollide() {
        this.collider && this.collider.disable();
        this.fire(SpawningEvent.Despawn);
    }


    //ss
}
import { Spawner } from "../../../script/spawners/spawner";
import { Character } from "./characters";
import { Entity } from "playcanvas";
import { SpawningEvent } from "../../../script/spawners/spawningEvent";
import { BoxCollider } from "../../../../physics/scripts/boxCollider";
import { CollisionTag } from "../../../../physics/collisionTag";
import { GameConstant } from "../../../../gameConstant";
import { Util } from "../../../../helpers/util";
import { Move } from "../../../script/components/move";
import { folowPrev } from "../../../script/controller/folowPrev";
import { anotherBurger } from "../itemInMap/anotherBurger";
import { PlayerController } from "../../../script/controller/playerController";
import { folowPrev2 } from "../../../script/controller/folowPrev2";
import { Tween } from "../../../../template/systems/tween/tween";
import { SplashFx } from "../../effect/splash";
import { Shit } from "../itemInMap/shit";
import { DoubleFork } from "../Itemlose/doubleFork";
import { Candy1 } from "../itemInMap/Candy1";
import { flame } from "../../effect/fire";
export class CharacterFactory extends Entity {
    constructor(ran) {
        super();
        this.ran = ran
        this._initSpawner();

        this.on(SpawningEvent.Spawn, () => {
            this.value = 0;

            this.collider && this.collider.enable();
            this.abs.forEach((ab, index) => {
                ab.fire(SpawningEvent.Despawn)
            })



        });
        this.elements = [];
        this.abs = []
        this.decors = []
        this.trapFollow = []
        this.trash = []
        this.abY = 2
    }
    config2(data) {
        let pos = data.pos;
        let rot = data.rot;
        let scale = data.scale;
        this.setLocalPosition(pos.x, pos.y, pos.z);
        this.setLocalEulerAngles(rot.x, rot.y, rot.z);
        this.setLocalScale(scale.x, scale.y, scale.z);
    }

    config(data) {
        this.value = data.value;
        let valueString = this.value.split("-");
        let pos = data.pos;
        let rot = data.rot;
        let scale = data.scale;
        this.setLocalPosition(pos.x, pos.y, pos.z);
        this.setLocalEulerAngles(rot.x, rot.y, rot.z);
        this.setLocalScale(scale.x, scale.y, scale.z);
        for (let i = 0; i < valueString.length; i++) {
            var element = valueString[i];
            let character = this.createCharacter(element);
            this.addChild(character);
        }
        this.updateSize(valueString);
        this.collider = this.elements[0].addScript(BoxCollider, {
            tag: CollisionTag.Player,
            render: GameConstant.DEBUG_COLLIDER,
            position: new pc.Vec3(0, 0, 0),
            scale: new pc.Vec3(1.5, 2, 1.5),
        });
        // this.collider.initialize();
        //this.collider.box.setLocalScale(0.5 * valueString.length, 1, 0.5)
    }
    _initSpawner() {
        // create each number to render

        let burgerTopSpawnerEntity = new Entity("burgerTopSpawner");
        this.addChild(burgerTopSpawnerEntity);
        this.burgerTopSpawner = burgerTopSpawnerEntity.addScript(Spawner, {
            class: Character,
            poolSize: 10,
            args: ["BurgerTop"]
        });
        this.burgerTopSpawner.initialize();
        this.burgerTopSpawner.postInitialize();

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

        let burgerBotSpawnerEntity = new Entity("burgerBotSpawner");
        this.addChild(burgerBotSpawnerEntity);
        this.burgerBotSpawner = burgerBotSpawnerEntity.addScript(Spawner, {
            class: Character,
            poolSize: 10,
            args: ["BurgerBot"]
        });
        this.burgerBotSpawner.initialize();
        this.burgerBotSpawner.postInitialize();

        let saladItemSpawnerEntity = new Entity("saladItemSpawner");
        this.addChild(saladItemSpawnerEntity);
        this.saladItemSpawner = saladItemSpawnerEntity.addScript(Spawner, {
            class: Character,
            poolSize: 10,
            args: ["BurgerItemSalad"]
        });
        this.saladItemSpawner.initialize();
        this.saladItemSpawner.postInitialize();

        let cheeseItemSpawnerEntity = new Entity("cheeseItemSpawner");
        this.addChild(cheeseItemSpawnerEntity);
        this.cheeseItemSpawner = cheeseItemSpawnerEntity.addScript(Spawner, {
            class: Character,
            poolSize: 10,
            args: ["BurgerItemCheese_1"]
        });
        let candy1SpawnerEntity = new Entity("cheeseItemSpawner");
        this.addChild(candy1SpawnerEntity);
        this.candy1Spawner = candy1SpawnerEntity.addScript(Spawner, {
            class: Character,
            poolSize: 10,
            args: ["Candy1"]
        });
        let candy4SpawnerEntity = new Entity("candy4SpawnerEntity");
        this.addChild(candy4SpawnerEntity);
        this.candy4Spawner = candy4SpawnerEntity.addScript(Spawner, {
            class: Character,
            poolSize: 10,
            args: ["Candy4"]
        });
        let candy5SpawnerEntity = new Entity("candy5SpawnerEntity");
        this.addChild(candy5SpawnerEntity);
        this.candy5Spawner = candy5SpawnerEntity.addScript(Spawner, {
            class: Character,
            poolSize: 10,
            args: ["Candy5"]
        });
        let candy3SpawnerEntity = new Entity("candy3SpawnerEntity");
        this.addChild(candy3SpawnerEntity);
        this.candy3Spawner = candy3SpawnerEntity.addScript(Spawner, {
            class: Character,
            poolSize: 10,
            args: ["Candy3"]
        });
        let gangsterSpawnerEntity = new Entity("gangsterSpawnerEntity");
        this.addChild(gangsterSpawnerEntity);
        this.gangSterSpawner = gangsterSpawnerEntity.addScript(Spawner, {
            class: Character,
            poolSize: 2,
            args: ["3_Gangster"]
        });
        let wingSpawnerEntity = new Entity("wingSpawnerEntity");
        this.addChild(wingSpawnerEntity);
        this.wingSpawner = wingSpawnerEntity.addScript(Spawner, {
            class: Character,
            poolSize: 2,
            args: ["2_Wing"]
        });
        let usSpawnerEntity = new Entity("usSpawnerEntity");
        this.addChild(usSpawnerEntity);
        this.usSpawner = usSpawnerEntity.addScript(Spawner, {
            class: Character,
            poolSize: 2,
            args: ["7_Flag US"]
        });
        // this.cheeseItemSpawner.initialize();
        // this.cheeseItemSpawner.postInitialize();

        let OnionItemSpawnerEntity = new Entity("OnionItemSpawner");
        this.addChild(OnionItemSpawnerEntity);
        this.OnionItemSpawner = OnionItemSpawnerEntity.addScript(Spawner, {
            class: Character,
            poolSize: 10,
            args: ["BurgerItemOnion"]
        });
        this.OnionItemSpawner.initialize();
        this.OnionItemSpawner.postInitialize();

        let TomatoItemSpawnerEntity = new Entity("TomatoItemSpawner");
        this.addChild(TomatoItemSpawnerEntity);
        this.TomatoItemSpawner = TomatoItemSpawnerEntity.addScript(Spawner, {
            class: Character,
            poolSize: 10,
            args: ["BurgerItemTomato"]
        });
        this.TomatoItemSpawner.initialize();
        this.TomatoItemSpawner.postInitialize();

        let HotdogItemSpawnerEntity = new Entity("HotdogItemSpawner");
        this.addChild(HotdogItemSpawnerEntity);
        this.HotdogItemSpawner = HotdogItemSpawnerEntity.addScript(Spawner, {
            class: Character,
            poolSize: 10,
            args: ["BurgerItemHotDog"]
        });
        this.HotdogItemSpawner.initialize();
        this.HotdogItemSpawner.postInitialize();

        let anotherBurgerSpawnerEntity = new Entity("anotherBurgerSpawner");
        // this.parent.addChild(anotherBurgerSpawnerEntity);
        this.anotherBurgerSpawner = anotherBurgerSpawnerEntity.addScript(Spawner, {
            class: anotherBurger,
            poolSize: 10,
            args: ["anotherBurger"]
        });
        let shitSpawnerEntity = new Entity("shitSpawnerEntity");
        this.addChild(shitSpawnerEntity);
        this.shitSpawner = shitSpawnerEntity.addScript(Spawner, {
            class: Character,
            poolSize: 10,
            args: ["Shit"]
        });
        this.anotherBurgerSpawner.initialize();
        this.anotherBurgerSpawner.postInitialize();
        let splashFxEntity = new pc.Entity();
        this.addChild(splashFxEntity);
        this.splashFxSpawner = splashFxEntity.addScript(Spawner, {
            class: SplashFx,
            poolSize: 2,
        });
        this.splashFxSpawner.initialize();
        let forkEntity = new pc.Entity();
        this.addChild(forkEntity);
        this.forkSpawner = forkEntity.addScript(Spawner, {
            class: DoubleFork,
            poolSize: 10,
        });

        this.cacheShader();


        //  let flameEntity = new pc.Entity();
        // this.addChild(flameEntity);
        // this.flameSpawner = flameEntity.addScript(Spawner, {
        //     class: flame,
        //     poolSize: 5,
        // });
        // this.flameSpawner.initialize();
        // this.flameSpawner.postInitialize();
    }

    cacheShader() {
        let shaderEntity = new Entity();
        this.addChild(shaderEntity);
        let fx = this.splashFxSpawner.spawnAt(shaderEntity);
        fx.play();
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
            case "itemChesse":
                return this.cheeseItemSpawner;
            case "itemSalad":
                return this.saladItemSpawner;
            case "itemOnion":
                return this.OnionItemSpawner;
            case "itemTomato":
                return this.TomatoItemSpawner;
            case "itemHotDog":
                return this.HotdogItemSpawner;
            case "itemShit":
                return this.shitSpawner
            case "gangster":
                return this.gangSterSpawner
            case "wing":
                return this.wingSpawner
            case "Us":
                return this.usSpawner
            case "itemCandy1":
                return this.candy1Spawner
            case "itemCandy3":
                return this.candy3Spawner
            case "itemCandy4":
                return this.candy4Spawner
            case "itemCandy5":
                return this.candy5Spawner
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
            if (element.name === "BurgerTop" || element.name === "Cake_Candy_Top") {
                // có 2 khoảng RANGE_BURGER_MEAT ở khoảng burgerBot và top
                var temp = GameConstant.RANGE_BURGER_MEAT * 2
                if (this.elements.length === 2) {
                    // ban đầu có 2 phần tử burgerBot và burgerTop thì cách ra như sau 
                    temp = GameConstant.RANGE_BURGERTOP_BURGERBOT
                    if (element.name === "Cake_Candy_Top") {
                        temp /= 1.75
                    }
                }
                if (element.name === "Cake_Candy_Top") {
                    temp /= 1.75
                }
                element.setLocalPosition(element.getLocalPosition().x, (index - 1) * GameConstant.RANGE_MEAT_MEAT + temp, element.getLocalPosition().z);  //bằng vị trí của miếng thịt phía trước cộng với khoảng cách 
            }
            else if (index > 0 && element.name !== "BurgerTop" || element.name === "Cake_Candy_Top") {
                element.setLocalScale(scale, scale, scale);

                // rotation cac mieng thit theo cac huong ngau nhien
                if (!element.rotationY) {
                    element.rotationY = Util.getRandomValue()
                }
                // Khoảng cách giữa các miếng thịt và + thêm khoảng RANGE_BURGER_MEAT do miếng thịt đầu tiên cộng thêm khoảng này 
                element.setLocalPosition(element.getLocalPosition().x, index * GameConstant.RANGE_MEAT_MEAT + GameConstant.RANGE_BURGER_MEAT, element.getLocalPosition().z);
                element.setLocalEulerAngles(0, element.rotationY, 0);
            }
        });
        this.addMove()
        this.abs.push(this)
        return scale;
    }
    updateWhenEat(valueString) {

        let scale = 1;
        this.elements.forEach((element, index) => {
            element.setLocalScale(scale, scale, scale);
            if (element.name === "BurgerTop" || element.name === "Cake_Candy_Top") {
                // có 2 khoảng RANGE_BURGER_MEAT ở khoảng burgerBot và top
                var temp = GameConstant.RANGE_BURGER_MEAT * 2
                if (this.elements.length === 2) {
                    // ban đầu có 2 phần tử burgerBot và burgerTop thì cách ra như sau 
                    temp = GameConstant.RANGE_BURGERTOP_BURGERBOT
                    if (element.name === "Cake_Candy_Top") {
                        temp /= 1.75
                    }
                }
                if (element.name === "Cake_Candy_Top") {
                    temp /= 1.75
                }
                element.setLocalPosition(element.getLocalPosition().x, (index - 1) * GameConstant.RANGE_MEAT_MEAT + temp, this.elements[0].getLocalPosition().z);  //bằng vị trí của miếng thịt phía trước cộng với khoảng cách 
            }
            else if (index === 1) {
                if (!element.rotationY) {
                    element.rotationY = Util.getRandomValue()
                }

                // Khoảng cách giữa các miếng thịt và + thêm khoảng RANGE_BURGER_MEAT do miếng thịt đầu tiên cộng thêm khoảng này 
                element.setLocalPosition(element.getLocalPosition().x, GameConstant.RANGE_BURGER_MEAT + index * GameConstant.RANGE_MEAT_MEAT, this.elements[0].getLocalPosition().z);
                element.setLocalEulerAngles(0, element.rotationY, 0);
                if (index === this.elements.length - 2) {
                    element.setLocalPosition(this.elements[index - 1].getLocalPosition().x, index * GameConstant.RANGE_MEAT_MEAT + GameConstant.RANGE_BURGER_MEAT, this.elements[0].getLocalPosition().z);

                }
            }
            else if (index > 1 && element.name !== "BurgerTop" && element.name !== "Cake_Candy_Top") {
                element.setLocalScale(scale, scale, scale);
                if (element.name === "Shit") element.setLocalScale(scale, scale / 5, scale);
                // rotation cac mieng thit theo cac huong ngau nhien
                if (!element.rotationY) {
                    element.rotationY = Util.getRandomValue()
                }

                // Khoảng cách giữa các miếng thịt và + thêm khoảng RANGE_BURGER_MEAT do miếng thịt đầu tiên cộng thêm khoảng này 
                element.setLocalPosition(element.getLocalPosition().x, index * GameConstant.RANGE_MEAT_MEAT + GameConstant.RANGE_BURGER_MEAT, this.elements[0].getLocalPosition().z);
                if (index === this.elements.length - 2) {
                    element.setLocalPosition(this.elements[index - 1].getLocalPosition().x, index * GameConstant.RANGE_MEAT_MEAT + GameConstant.RANGE_BURGER_MEAT, this.elements[0].getLocalPosition().z);

                }
                element.setLocalEulerAngles(0, element.rotationY, 0);
                if (element.name === "3_Gangster") element.setLocalEulerAngles(0, 0, 0);

            }
        });

        this.addMove()
        Tween.createLocalTranslateTween(this.elements[this.elements.length - 1], { y: "+0.3" }, {
            duration: 0.07,
            repeat: 1,
            yoyo: true,

        }).start();
        this.splachFx()
        return scale;
    }

    onCollide() {
        this.collider && this.collider.disable();
        this.fire(SpawningEvent.Despawn);
    }

    updateValue(value) {
        this.bt = this.elements.pop()
        this.bt.fire(SpawningEvent.Despawn);
        let newItem = this.createCharacter(value);
        if (this.ran === 2) {
            this.bt = this.createCharacter("CakeTop");
        }
        else {
            this.bt - this.createCharacter("BurgerTop")
        }
        this.addChild(newItem);
        this.addChild(this.bt);
        this.updateWhenEat();
    }
    addMove() {
        this.prev = null

        this.prev = this.elements[0]
        this.elements.forEach((element) => {
            if (element.script) {
                //xóa ràng buộc cũ để thay ràng buộc mới
                element.script.destroy("folowPrev")
            }
            if (element.name === "BurgerBot" || element.name === "Cake_Candy_Botton") {
                return
            }
            element.addScript(folowPrev, {
                prevCharacter: this.prev
            });
            this.prev = element
        });
    }
    addAnotherBurger(other) {
        this.ab = this.anotherBurgerSpawner.spawn();
        if (this.ab.flame) {
            this.ab.removeChild(this.flame)
        }
        this.parent.addChild(this.ab)
        if (this.abs.length === 0) {
            if (this.ran === 1) {
                this.ab.config({
                    value: GameConstant.PLAYER_MODEL, //number start value when render
                    pos: { x: this.getLocalPosition().x, y: this.getLocalPosition().y, z: this.getLocalPosition().z + this.abY }, //position of number
                    rot: { x: 0, y: 0, z: 0 }, //rotation of number
                    scale: { x: 1, y: 1, z: 1 } //scale of number //number start value when render
                });
            }
            else {
                this.ab.config({
                    value: "CakeBot-CakeTop", //number start value when render
                    pos: { x: this.getLocalPosition().x, y: this.getLocalPosition().y, z: this.getLocalPosition().z + this.abY }, //position of number
                    rot: { x: 0, y: 0, z: 0 }, //rotation of number
                    scale: { x: 1, y: 1, z: 1 } //scale of number //number start value when render
                });
            }

        }
        else {
            if (this.ran === 1) {
                this.ab.config({
                    value: GameConstant.PLAYER_MODEL, //number start value when render
                    pos: { x: this.abs[this.abs.length - 1].getLocalPosition().x, y: this.abs[this.abs.length - 1].getLocalPosition().y, z: this.getLocalPosition().z + this.abY }, //position of number
                    rot: { x: 0, y: 0, z: 0 }, //rotation of number
                    scale: { x: 1, y: 1, z: 1 } //scale of number //number start value when render

                });
            }
            else {
                this.ab.config({
                    value: "CakeBot-CakeTop", //number start value when render
                    pos: { x: this.abs[this.abs.length - 1].getLocalPosition().x, y: this.abs[this.abs.length - 1].getLocalPosition().y, z: this.getLocalPosition().z + this.abY }, //position of number
                    rot: { x: 0, y: 0, z: 0 }, //rotation of number
                    scale: { x: 1, y: 1, z: 1 } //scale of number //number start value when render

                });
            }


        }

        if (this.abs.length > 0) {
            if (this.ab.follow2) {
                this.ab.elements[0].script.destroy('folowPrev2')

            }

            this.ab.follow2 = this.ab.elements[0].addScript(folowPrev2, {
                prevCharacter: this.abs[this.abs.length - 1].elements[0]
            });

        }
        else {
            if (this.ab.follow2) {
                this.ab.follow2.prevCharacter = this.elements[0]
            }
            else {
                this.ab.follow2 = this.ab.elements[0].addScript(folowPrev2, {
                    prevCharacter: this.elements[0]
                });
            }

        }
        this.abs.push(this.ab)
        if (!this.ab.controller)
            this.ab.controller = this.ab.elements[0].addScript(PlayerController, {
                collider: this.ab.collider,
            });

        this.abY += 2
    }

    hand_left(obj) {

        this.abs = Util.deleteElement(this.abs, obj)
        this.trash.push(obj)
        // if (this.elements.length === 0) {
        //     this.parent.move = false
        // }
        // this.parent.removeChild(obj)
        // obj.fire(SpawningEvent.Despawn)
        let temp = 0
        this.abs.forEach((element, index) => {
            if (index === 0) {
                element.config2({
                    value: GameConstant.PLAYER_MODEL, //number start value when render
                    pos: { x: this.getLocalPosition().x, y: this.getLocalPosition().y, z: this.getLocalPosition().z + temp }, //position of number
                    rot: { x: 0, y: 0, z: 0 }, //rotation of number
                    scale: { x: 1, y: 1, z: 1 } //scale of number //number start value when render
                });

            }
            else {
                element.config2({
                    value: GameConstant.PLAYER_MODEL, //number start value when render
                    pos: { x: this.abs[index - 1].getLocalPosition().x, y: this.abs[index - 1].getLocalPosition().y, z: this.getLocalPosition().z + temp }, //position of number
                    rot: { x: 0, y: 0, z: 0 }, //rotation of number
                    scale: { x: 1, y: 1, z: 1 } //scale of number //number start value when render
                });
                if (element.elements[0].script) {
                    element.elements[0].script.destroy("folowPrev2")
                    element.follow2 = element.elements[0].addScript(folowPrev2, {
                        prevCharacter: this.abs[index - 1].elements[0]
                    });
                }

            }


            temp += 2
            this.abY = temp

        })
    }
    reset() {
        if (this.fork) {
            this.fork.destroy()
        }
        if (this.onFire) {
            this.onFire = false
            this.flame.destroy()
        }
        this.trash.forEach(item => {
            if (item.onFire)
                item.flame.destroy()
        })
        // this.trapFollow.forEach(item=>{
        //     item.fire(SpawningEvent.Despawn)
        // })
        //         this.trapFollow = []

        this.enabled = true
        // Reset any properties or state variables to their initial values here
        this.value = 0;
        this.collider && this.collider.enable();

        // Despawn and reset any child elements or objects
        const newElements = [];
        this.elements.forEach((element) => {
            if (element.name === 'BurgerTop' || element.name === 'BurgerBot' || element.name === 'Cake_Candy_Top' || element.name === 'Cake_Candy_Botton') {
                newElements.push(element);
            } else {
                if (element.script) {
                    //xóa ràng buộc cũ để thay ràng buộc mới
                    element.script.destroy("folowPrev")
                }
                element.fire(SpawningEvent.Despawn);
            }
        });
        this.elements = newElements;
        this.addMove()
        this.updateWhenEat()
        this.abs.forEach((ab, index) => {
            if (ab.follow2) {
                ab.elements[0].script.destroy('folowPrev2')

            }
            if (ab !== this)
                ab.reset()
            ab.fire(SpawningEvent.Despawn);

        });
        this.decors.forEach((d, index) => {
            d.fire(SpawningEvent.Despawn);
        });
        this.decors = []
        this.abs = [];
        this.abs.push(this)
        // Reset any other properties or state as needed
        this.abY = 2;
        if (this.fork)
            this.fork.fire(SpawningEvent.Despawn)
        // You can also reinitialize any components or scripts here if needed
        //this._initSpawner();
    }
    splachFx() {
        let pos = this.elements[this.elements.length - 1].getPosition();
        let fx = this.splashFxSpawner.spawnTo(pos);
        fx.play();
    }
    onFlame() {
        let flame = this.flameSpawner.spawn()
        this.trapFollow.push(flame)
        this.elements[0].addChild(flame)
        flame.play()
    }
    forkDame() {
        this.fork = this.forkSpawner.spawn()
        this.elements[this.elements.length - 1].addChild(this.fork)
    }
    hammerDame(obj) {
        this.abs = Util.deleteElement(this.abs, obj)
        // if (this.elements.length === 0) {
        //     this.parent.move = false
        // }
        obj.enabled = false
        obj.fire(SpawningEvent.Despawn)
        let temp = 0
        this.abs.forEach((element, index) => {
            if (index === 0) {
                element.config2({
                    value: GameConstant.PLAYER_MODEL, //number start value when render
                    pos: { x: this.getLocalPosition().x, y: this.getLocalPosition().y, z: this.getLocalPosition().z + temp }, //position of number
                    rot: { x: 0, y: 0, z: 0 }, //rotation of number
                    scale: { x: 1, y: 1, z: 1 } //scale of number //number start value when render
                });

            }
            else {
                element.config2({
                    value: GameConstant.PLAYER_MODEL, //number start value when render
                    pos: { x: this.abs[index - 1].getLocalPosition().x, y: this.abs[index - 1].getLocalPosition().y, z: this.getLocalPosition().z + temp }, //position of number
                    rot: { x: 0, y: 0, z: 0 }, //rotation of number
                    scale: { x: 1, y: 1, z: 1 } //scale of number //number start value when render
                });
                if (element.elements[0].script) {
                    element.elements[0].script.destroy("folowPrev2")
                    element.elements[0].addScript(folowPrev2, {
                        prevCharacter: this.abs[index - 1].elements[0]
                    });
                }

            }


            temp += 2
            this.abY = temp

        })
    }


    //ss
}
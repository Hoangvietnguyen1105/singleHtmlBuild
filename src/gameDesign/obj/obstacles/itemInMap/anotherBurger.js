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
import { PlayerController } from "../../../script/controller/playerController";
import { Tween } from "../../../../template/systems/tween/tween";
import { SplashFx } from "../../effect/splash";
import { DoubleFork } from "../Itemlose/doubleFork";
import { flame } from "../../effect/fire";
export class anotherBurger extends Entity {
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
        this.trapFollow = []

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
        if (!this.elements[0].script) {
            this.collider = this.elements[0].addScript(BoxCollider, {
                tag: CollisionTag.Player,
                render: GameConstant.DEBUG_COLLIDER,
                position: new pc.Vec3(0, 0, 0),
                scale: new pc.Vec3(1.5, 1.5, 1.5),
            });
        }

        // this.collider.initialize();
        //this.collider.box.setLocalScale(0.5 * valueString.length, 1, 0.5)
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
            poolSize: 10,
            args: ["BurgerTop"]
        });
        this.burgerTopSpawner.initialize();
        this.burgerTopSpawner.postInitialize();

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
        this.cheeseItemSpawner.initialize();
        this.cheeseItemSpawner.postInitialize();

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
        let shitSpawnerEntity = new Entity("shitSpawnerEntity");
        this.addChild(shitSpawnerEntity);
        this.shitSpawner = shitSpawnerEntity.addScript(Spawner, {
            class: Character,
            poolSize: 10,
            args: ["Shit"]
        });
        let gangsterSpawnerEntity = new Entity("gangsterSpawnerEntity");
        this.addChild(gangsterSpawnerEntity);
        this.gangSterSpawner = gangsterSpawnerEntity.addScript(Spawner, {
            class: Character,
            poolSize: 10,
            args: ["3_Gangster"]
        });


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
        //  let flameEntity = new pc.Entity();
        // this.addChild(flameEntity);
        // this.flameSpawner = flameEntity.addScript(Spawner, {
        //     class: flame,
        //     poolSize: 5,
        // });
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
            case "gangster":
                return this.gangSterSpawner
            case "wing":
                return this.wingSpawner
            case "Us":
                return this.usSpawner
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
        // set vị trí các thằng con tại vị trí thằng cha(cho riếng element[0] ))
        if (this.parent.character) {
            this.elements[0].setLocalPosition(this.parent.character.elements[0].getLocalPosition().x, this.parent.character.elements[0].getLocalPosition().y, this.parent.character.elements[0].getLocalPosition().z + 2);
        }
        else {
            this.elements[0].setLocalPosition(this.parent.character.elements[0].getLocalPosition().x, this.parent.elements[0].getLocalPosition().y, this.parent.elements[0].getLocalPosition().z + 2);
        }
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
            else if (index === 1) {
                if (!element.rotationY) {
                    element.rotationY = Util.getRandomValue()
                }

                // Khoảng cách giữa các miếng thịt và + thêm khoảng RANGE_BURGER_MEAT do miếng thịt đầu tiên cộng thêm khoảng này 
                element.setLocalPosition(this.parent.character.elements[0].getLocalPosition().x, GameConstant.RANGE_BURGER_MEAT + index * GameConstant.RANGE_MEAT_MEAT, this.elements[0].getLocalPosition().z);
                element.setLocalEulerAngles(0, element.rotationY, 0);

            }
            else if (index > 1 && element.name !== "BurgerTop") {
                element.setLocalScale(scale, scale * 3, scale);
                if (element.name === 'BurgerItemHotDog') {
                    element.setLocalScale(scale, scale * 1.5, scale);
                }
                // rotation cac mieng thit theo cac huong ngau nhien
                if (!element.rotationY) {
                    element.rotationY = Util.getRandomValue()
                }

                // Khoảng cách giữa các miếng thịt và + thêm khoảng RANGE_BURGER_MEAT do miếng thịt đầu tiên cộng thêm khoảng này 
                element.setLocalPosition(this.parent.character.elements[0].getLocalPosition().x, index * GameConstant.RANGE_MEAT_MEAT + GameConstant.RANGE_BURGER_MEAT, this.elements[0].getLocalPosition().z);
                element.setLocalEulerAngles(0, element.rotationY, 0);
            }
        });
        this.addMove()
        return scale;
        return scale;
    }
    updateSize2(valueString) {

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
            else if (index === 1) {
                if (!element.rotationY) {
                    element.rotationY = Util.getRandomValue()
                }

                // Khoảng cách giữa các miếng thịt và + thêm khoảng RANGE_BURGER_MEAT do miếng thịt đầu tiên cộng thêm khoảng này 
                element.setLocalPosition(this.elements[0].getLocalPosition().x, GameConstant.RANGE_BURGER_MEAT + index * GameConstant.RANGE_MEAT_MEAT, this.elements[0].getLocalPosition().z);
                element.setLocalEulerAngles(0, element.rotationY, 0);

            }
            else if (index > 1 && element.name !== "BurgerTop") {
                element.setLocalScale(scale, scale, scale);
                if (element.name === "Shit") element.setLocalScale(scale, scale / 5, scale);

                if (element.name === 'BurgerItemHotDog') {
                    element.setLocalScale(scale, scale * 1.5, scale);
                }
                // rotation cac mieng thit theo cac huong ngau nhien
                if (!element.rotationY) {
                    element.rotationY = Util.getRandomValue()
                }

                // Khoảng cách giữa các miếng thịt và + thêm khoảng RANGE_BURGER_MEAT do miếng thịt đầu tiên cộng thêm khoảng này 
                element.setLocalPosition(this.elements[0].getLocalPosition().x, index * GameConstant.RANGE_MEAT_MEAT + GameConstant.RANGE_BURGER_MEAT, this.elements[0].getLocalPosition().z);
                element.setLocalEulerAngles(0, element.rotationY, 0);
                if (element.name === "3_Gangster") element.setLocalEulerAngles(0, 0, 0);

            }
        });
        this.addMove()
        // tạo tween cho burgerTop để nó nhảy lên nhảy xuống sau khi ăn item
        this.splachFx()
        Tween.createLocalTranslateTween(this.elements[this.elements.length - 1], { y: "+0.3" }, {
            duration: 0.07,
            repeat: 1,
            yoyo: true,

        }).start();
        return scale;
    }

    onCollide() {
        this.collider && this.collider.disable();
    }

    updateValue(value) {
                this.ran = this.parent.ran

        this.bt = this.elements.pop()
        this.bt.fire(SpawningEvent.Despawn);
        let newItem = this.createCharacter(value);
     if(this.ran === 2){
        this.bt = this.createCharacter("CakeTop");
        }
        else{
            this.bt - this.createCharacter("BurgerTop")
        }
        this.addChild(newItem);
        this.addChild(this.bt);
        this.updateSize2();    }
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
        if (this.parent.character) {
            this.parent.character.addAnotherBurger(other)
        }
        else {
            this.parent.addAnotherBurger(other)
        }
    }
    reset() {
        if(this.fork){
            this.fork.destroy()
        }
        if(this.onFire){
            this.onFire = false
            this.flame.destroy()
        }
        // this.trapFollow.forEach(item=>{
        //     item.fire(SpawningEvent.Despawn)
        // })
        // this.trapFollow = []
        this.elements.forEach(element => {
            element.fire(SpawningEvent.Despawn)
        })

        this.updateSize()
        this.elements = []
    }
    splachFx() {
        let pos = this.elements[this.elements.length - 1].getPosition();
        let fx = this.splashFxSpawner.spawnTo(pos);
        fx.play();
    }
     onFlame(){
        let flame = this.flameSpawner.spawn()
        this.trapFollow.push(flame)
                this.elements[0].addChild(flame)

        flame.setLocalScale(0.5,0.5,0.5)
    }
    forkDame() {
        this.fork = this.forkSpawner.spawn()
        this.elements[this.elements.length - 1].addChild(this.fork)
    }

    //ss
}
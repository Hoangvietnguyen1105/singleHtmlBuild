import { Entity, Vec3 } from "playcanvas";
import { ObjectType } from "./objectType";
import { Spawner } from "../../script/spawners/spawner";
import { Road } from "./road";
import { CharacterFactory } from "../obstacles/characters/characterFactory";
import { SpawningEvent } from "../../script/spawners/spawningEvent";
import { FinishLine } from "./finishLine";
import { Util } from "../../../helpers/util";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { GameConstant } from "../../../gameConstant";
import { BigBoss } from "../boss/bigBoss";
import { SoliderBoss } from "../boss/soliderBoss";
import { RedDamage } from "../obstacles/redDamage/redDamage";
import { Wall } from "../obstacles/wall/wall";
import { EndWall } from "../obstacles/wall/endWall";
import { MathOperator, MathWall } from "../obstacles/mathWall/mathWall";
import { Jump } from "../obstacles/jump/jump";
import { SawBlade } from "../obstacles/sawBlade/sawBlade";
import { SawBladeMove } from "../obstacles/sawBlade/sawBaldeMove";
import { AreaBox } from "../blockArea/areaBox";
import { FallObstacle } from "../obstacles/anotherRoad/FallObstacle";
import { UpHill } from "../obstacles/anotherRoad/upHill";
import { DownHill } from "../obstacles/anotherRoad/downHill";
import { BumpyRoad } from "../obstacles/anotherRoad/bumpyRoad";
import { Salad } from "../obstacles/itemInMap/Salad";
import { HotDog } from "../obstacles/itemInMap/HotDog";
import { Chesse } from "../obstacles/itemInMap/Chesse";
import { JumpState } from "../obstacles/itemInMap/JumpState";
import { JumpState2 } from "../obstacles/itemInMap/JumpState2";
import { Onion } from "../obstacles/itemInMap/Onion";
import { HandLeft } from "../obstacles/Itemlose/handLeft";
import { TheFace } from "../boss/theFace";
import { endRoad, endRoad1 } from "../obstacles/anotherRoad/endRoad";
import { anotherBurger } from "../obstacles/itemInMap/anotherBurger";
import { anotherBurgerItem } from "../obstacles/itemInMap/anotherBurgerItem";
import { Tween } from "../../../template/systems/tween/tween";
import { table } from "../boss/table";
import { Man } from "../boss/man";
import { endRoad2 } from "../obstacles/anotherRoad/endRoad2";
import { endRoad0 } from "../obstacles/anotherRoad/endRoad0";
import { HandRight } from "../obstacles/Itemlose/handRight";
import { Fork } from "../obstacles/Itemlose/fork";
import { Hob } from "../obstacles/Itemlose/hob";
import { Hammer } from "../obstacles/Itemlose/hammer";
import { gian } from "../obstacles/Itemlose/gian";
import { UpHillLow } from "../obstacles/anotherRoad/upHillLow";
import { Hole } from "../obstacles/anotherRoad/hole";
import { Knife } from "../obstacles/Itemlose/knife";
import { Shit } from "../obstacles/itemInMap/shit";
import { DoorDecor } from "../obstacles/itemInMap/DoorDecor";
import { curvedUp } from "../obstacles/anotherRoad/curvedUp";
import { curvedDown } from "../obstacles/anotherRoad/curvedDown";
import { DownHillLow } from "../obstacles/anotherRoad/downHillLow";
import { RollingDough } from "../obstacles/Itemlose/RollingDough";
import { Candy1 } from "../obstacles/itemInMap/Candy1";
import { Candy3 } from "../obstacles/itemInMap/Candy3";
import { Candy4 } from "../obstacles/itemInMap/Candy4";
import { Candy5 } from "../obstacles/itemInMap/Candy5";
import { DoorDecorUs } from "../obstacles/itemInMap/DoorDecorUs";
import { DoorDecorWing } from "../obstacles/itemInMap/DoorDecorWing";
export const LevelEndGameType = Object.freeze({
  Normal: "normal",
  BigBoss: "bigBoss",
  SoliderBoss: "soliderBoss",
});

export class Level extends Entity {
  constructor(ran) {
    super();
    this.ran = ran
    this._initMaterial();
    this._initSpawner();
    this.numbers = [];
    this.roads = [];
    this.redDamages = [];
    this.walls = [];
    this.bigBoss = null;
    this.roadBlockAreas = [];
    this.wallBlockAreas = [];
    this.mans = [];
    this.items = []
    this.anotherBGs = []
    this.upHills = []
    this.downHills = []
    this.itemPoins = []

  }


  reset() {
    for (let i = this.children.length - 1; i >= 0; i--) {
      let obj = this.children[i];
      obj.fire(SpawningEvent.Despawn, obj);
      // obj.destroy()
    }
    // this._initSpawner()
    this.numbers = [];
    this.roads = [];
    this.redDamages = [];
    this.walls = [];
    this.bigBoss = null;
    this.soliderBoss = null;
    this.wallBlockAreas = [];
    this.roadBlockAreas = [];
    this.items = []
    this.mans = [];
    this.anotherBGs = []
    this.upHills = []
    this.gamePlay = 2
    this.downHills = []
    this.itemPoins = []
  }

  _initMaterial() {
    this.redMat = AssetLoader.getAssetByKey("mat_red_wall").resource;
    this.greenMat = AssetLoader.getAssetByKey("mat_green_wall").resource;
    this.listMatNormal = [
      AssetLoader.getAssetByKey("mat_1_wall").resource,
      AssetLoader.getAssetByKey("mat_2_wall").resource,
      AssetLoader.getAssetByKey("mat_3_wall").resource,
      AssetLoader.getAssetByKey("mat_4_wall").resource,
      AssetLoader.getAssetByKey("mat_5_wall").resource,
      AssetLoader.getAssetByKey("mat_6_wall").resource,
      AssetLoader.getAssetByKey("mat_7_wall").resource,
      AssetLoader.getAssetByKey("mat_8_wall").resource,
      AssetLoader.getAssetByKey("mat_9_wall").resource,
      AssetLoader.getAssetByKey("mat_10_wall").resource,
    ];
  }

  config(levelData) {
    this.bossValue = levelData.bossValue;
    this.wallCount = levelData.wallCount;
    this.targetDamage = levelData.targetDamage;
    this.endCardType = levelData.endCardType;
    this.firstOffset = 16;
    this.distanceBetweenEndWall = 20;
    this.endPathPoint = new Vec3(0, 0, 0);
  }

  generate(levelData) {
    for (let i = 0; i < levelData.length; i++) {

      const data = Object.assign({}, levelData[i]);
      let obj = null;
      switch (data.tp) {
        case ObjectType.ROAD:
          obj = this.roadSpawner.spawn();
          obj.config(data);
          this.roads.push(obj);
          break;
        case ObjectType.endRoad0:
          obj = this.endRoad0Spawner.spawn();
          obj.config(data);
          this.roads.push(obj);
          break;
        case ObjectType.ENDROAD2:
          obj = this.endRoadSpawner.spawn();
          obj.config(data);
          this.roads.push(obj);
          break;
        case ObjectType.endRoad1:
          obj = this.endRoad1Spawner.spawn();
          obj.config(data);
          this.roads.push(obj);
          break;
        case ObjectType.UPHILL:
          obj = this.upHillSpawner.spawn();
          obj.config(data);
          this.roads.push(obj);
          break;
        case ObjectType.UPHILLLOW:
          obj = this.upHillLowSpawner.spawn();

          obj.config(data);
          obj.targetPos = obj.getLocalPosition().y
          this.upHills.push(obj);
          break;
        case ObjectType.GIAN:
          obj = this.gianSpawner.spawn();
          obj.config(data);
          break;
        case ObjectType.DOWNHILL:
          obj = this.downHillSpawner.spawn();
          obj.config(data);
          this.roads.push(obj);
          break;
        case ObjectType.DOWNHILLLOW:
          obj = this.dhlSpawner.spawn();
          obj.config(data);
          this.downHills.push(obj);
          break;
        case ObjectType.BUMPYROAD:
          obj = this.bumpyRoadSpawner.spawn(
          );
          obj.config(data);
          this.roads.push(obj);
          break;
        case ObjectType.CURVEDUP:
          obj = this.curvedUpSpawner.spawn()
          obj.config(data);
          this.roads.push(obj);
          break;
        case ObjectType.CURVEDDOWN:
          obj = this.curvedDownSpawner.spawn()
          obj.config(data);
          this.roads.push(obj);
          break;
        case ObjectType.SALAD:
          obj = this.saladSpawner.spawn();
          obj.config(data);
          this.flyEffect(obj)
          this.items.push(obj)
          break;
        case ObjectType.FallObstacle:
          obj = this.fallObstacleSpawner.spawn();
          obj.config(data);
          break;
        case ObjectType.CHESSE:
          let dataY = data.pos.y
          let ran = Util.randomInt(1, 5)

          if (ran === 1 || ran === 2) {
            if (this.ran === 1) {
              obj = this.chesseSpawner.spawn();
            }
            if (this.ran === 2) {
              data.pos.y += 0.5
              obj = this.candy1Spawner.spawn()
            }
          }
          if (ran === 3) {
            if (this.ran === 1) {
              obj = this.saladSpawner.spawn();
            }
            if (this.ran === 2) {

              obj = this.candy3Spawner.spawn()
              data.pos.y += 0.5
            }
          }
          if (ran === 4) {
            if (this.ran === 1) {
              obj = this.onionSpawner.spawn();
              data.pos.y += 0.5
            }
            if (this.ran === 2) {
              obj = this.candy4Spawner.spawn()
              data.pos.y += 0.5
            }
          }
          if (ran === 5) {
            if (this.ran === 1) {
              obj = this.hotdogSpawner.spawn();
              data.pos.y += 0.5
            }
            if (this.ran === 2) {
              obj = this.candy5Spawner.spawn()
              data.pos.y += 0.5
            }

          }
          obj.config(data);
          data.pos.y = dataY
          this.flyEffect(obj)
          this.items.push(obj)
          this.itemPoins.push(obj)

          break;
        case ObjectType.SHIT:
          obj = this.shitSpawner.spawn();
          obj.config(data);
          this.flyEffect(obj)
          this.items.push(obj)
          break;
        case ObjectType.HOTDOG:
          obj = this.hotdogSpawner.spawn();
          obj.config(data);
          this.flyEffect(obj)
          this.items.push(obj)
          break;
        case ObjectType.JUMPSTATE:
          obj = this.jumpStateSpawner.spawn();
          obj.config(data);
          break;
        case ObjectType.JUMPSTATE2:
          obj = this.jumpState2Spawner.spawn();
          obj.config(data);
          break;
        case ObjectType.HANDLEFT:
          obj = this.handLeftSpawner.spawn();
          Tween.createCountTween({
            duration: 0.5,
            onComplete() {
              obj.wavingHand()
            }
          })
          obj.config(data);
          break;
        case ObjectType.hammer:
          obj = this.hammerSpawner.spawn();
          obj.config(data);
          break;
        case ObjectType.RollingDough:
          obj = this.RollingDoughSpawner.spawn();
          obj.config(data);
          break;
        case ObjectType.hand_right:
          obj = this.handRightSpawner.spawn();
          Tween.createCountTween({
            duration: 0.5,
            onComplete() {
              obj.wavingHand()
            }
          })
          obj.config(data);
          break;
        case ObjectType.fork:
          obj = this.ForkSpawner.spawn();
          obj.config(data);
          break;
        case ObjectType.hob:
          obj = this.HobSpawner.spawn();
          obj.config(data);
          break;
        case ObjectType.ONION:
          obj = this.onionSpawner.spawn();
          obj.config(data);
          this.flyEffect(obj)
          this.items.push(obj)

          break;
        case ObjectType.THEFACE:
          obj = this.theFaceSpawner.spawn();
          obj.config(data);

          this.theFace = obj
          break;
        case ObjectType.man:
          obj = this.manSpawner.spawn();
          obj.config(data);
          Tween.createCountTween({
            duration: 1,
            onUpdate: () => { },
            onComplete: () => { obj.stand() }
          }).start()
          this.mans.push(obj)
          break;
        case ObjectType.table:
          obj = this.tableSpawner.spawn();
          obj.config(data);
          break;
        case ObjectType.ANOTHERBURGER:
          obj = this.anotherBurgerSpawner.spawn();
          if (this.ran === 1) {
            obj.config({
              value: GameConstant.PLAYER_MODEL,
            });
          }
          if (this.ran === 2) {
            obj.config({
              value: "CakeTop-CakeBot",
            });
          }

          obj.config2(data);
          this.flyEffect(obj)
          this.anotherBGs.push(obj)
          this.gamePlay = 1

          break;
        case ObjectType.HOLE:
          obj = this.holeSpawner.spawn();
          obj.config(data);
          break;
        case ObjectType.KNIFE:
          obj = this.knifeSpawner.spawn();
          obj.config(data);
          break;
        case ObjectType.DOORDECOR:
          obj = this.DoorDecorSpawner.spawn();
          obj.config(data);
          break;
        case ObjectType.DOORDECORUS:
          obj = this.DoorDecorUsSpawner.spawn();
          obj.config(data);
          break;
        case ObjectType.DOORDECORWING:
          obj = this.DoorDecorWingSpawner.spawn();
          obj.config(data);
          break;
        default: {
          obj = new Entity();
          break;
        }
      }
      this.addChild(obj);
    }

    this.generateEndWalls();
  }
  returnTheFace() {
    return this.theFace
  }
  configUpHill() {
    for (var i = this.upHills.length - 2; i >= 0; i--) {
      if (this.upHills[i].getLocalPosition().z + 8 == this.upHills[i + 1].getLocalPosition().z) {
        this.upHills[i].targetPos = this.upHills[i + 1].targetPos
      }
    }
    for (var i = this.downHills.length - 2; i >= 0; i--) {
      if (this.downHills[i].getLocalPosition().z + 8 == this.upHills[i + 1].getLocalPosition().z) {
        this.downHills[i].targetPos = this.downHills[i + 1].targetPos
      }
    }
  }
  returnMan() {

  }

  spawnEndWall(data) {
    let endWall = this.endWallSpawner.spawn();
    let mat = null;
    let value = this.getEndWallValue(data.value);
    let operator = this.getEndWallOperator(data.value);
    if (operator === MathOperator.SUB || operator === MathOperator.DIV) {
      mat = this.redMat;
    } else {
      mat = this.greenMat;
    }
    let wallConfig = {
      position: new Vec3(data.pos.x, data.pos.y, data.pos.z),
      rot: new Vec3(0, 0, 0),
      size: new Vec3(data.scale.x, data.scale.y, data.scale.z),
      material: mat,
      value: value,
    }
    endWall.config(wallConfig, operator);
    this.walls.push(endWall);
    return endWall;
  }

  getEndWallOperator(value) {
    let operator = value.substring(0, 1);
    return operator;
  }

  getEndWallValue(value) {
    let val = value.substring(1, value.length);
    return parseInt(val);
  }

  flyEffect(obj) {
    Tween.createLocalTranslateTween(obj, { y: "+0.3" }, {
      duration: 0.7,
      repeat: true,
      loop: true,
      yoyo: true,
    }).start();
  }

  generateEndWalls() {
    var rightPos = new Vec3(1, 0, 0);
    var position = Vec3.ZERO;
    var forward = new Vec3(0, 0, 1);
    var baseHealth = Math.floor(this.targetDamage / this.wallCount);
    if (this.endCardType === LevelEndGameType.BigBoss || this.endCardType === LevelEndGameType.SoliderBoss) {

    }

    this.maxDistanceFromEndPath = position.clone().sub(this.endPathPoint).length();
    this.generateEndRoads();
  }

  generateEndRoads() {
    var distanceBetweenRoad = GameConstant.DISTANCE_BETWEEN_ROAD;
    let forward = new Vec3(0, 0, 1);
    let roadEndPosition = this.roads[this.roads.length - 1].getLocalPosition().clone();
    for (let i = 1; i < 300; i++) {
      let spawnPos = roadEndPosition.clone().add(forward.clone().scale(distanceBetweenRoad * i));
      if (spawnPos.clone().sub(this.endPathPoint).length() < this.maxDistanceFromEndPath + GameConstant.END_ROAD_BONUS) {
        let road = this.roadSpawner.spawn();
        let data = {
          pos: spawnPos,
          rot: new Vec3(0, 0, 0),
          scale: new Vec3(1, 1, 1),
        };
        road.config(data);
        // road.setLocalScale(1.5, 1, 0.65)
        this.createRoadBlockArea(road);
        this.roads.push(road);
        this.addChild(road);
      } else {
        if (this.endCardType !== LevelEndGameType.Normal) {
          let bossPos = roadEndPosition.clone().add(forward.clone().scale(distanceBetweenRoad * i - 1));
          if (this.endCardType === LevelEndGameType.BigBoss) {
            let bigBoss = this.createBigBoss();
            let rot = new Vec3(0, 0, 0);
            let scale = new Vec3(1, 1, 1);
            let data = {
              pos: bossPos,
              rot,
              scale,
              value: this.bossValue,
            }
            bigBoss.config(data);
            this.addChild(bigBoss);
          } else {
            let soliderBoss = this.createSoliderBoss();
            let rot = new Vec3(0, 0, 0);
            let scale = new Vec3(1, 1, 1);
            let data = {
              pos: bossPos,
              rot,
              scale,
              value: this.bossValue,
            }
            soliderBoss.config(data);
            this.addChild(soliderBoss);
          }
        }
        break;
      }
    }
  }

  createFinishLine() {
    let finishLine = this.finishLineSpawner.spawn();
    return finishLine;
  }

  createBigBoss() {
    let bigBoss = this.bigBossSpawner.spawn();
    this.bigBoss = bigBoss;
    return bigBoss;
  }

  createSoliderBoss() {
    let solider = this.soliderBossSpawner.spawn();
    this.soliderBoss = solider;
    return solider;
  }

  _initSpawner() {
    let roadSpawnerEntity = new Entity("road-spawner");
    this.addChild(roadSpawnerEntity);
    this.roadSpawner = roadSpawnerEntity.addScript(Spawner, {
      class: Road,
      poolSize: 10,
    });
    let endRoadSpawnerEntity = new Entity("endRoad-spawner");
    this.addChild(endRoadSpawnerEntity);
    this.endRoadSpawner = endRoadSpawnerEntity.addScript(Spawner, {
      class: endRoad2,
      poolSize: 10,
    });


    let fallObstacleSpawnerEntity = new Entity("fall-obstacle-spawner");
    this.addChild(fallObstacleSpawnerEntity);
    this.fallObstacleSpawner = fallObstacleSpawnerEntity.addScript(Spawner, {
      class: FallObstacle,
      poolSize: 10,
    });

    let bumpyRoadSpawnerEntity = new Entity("bumpy-road-spawner");
    this.addChild(bumpyRoadSpawnerEntity);
    this.bumpyRoadSpawner = bumpyRoadSpawnerEntity.addScript(Spawner, {
      class: BumpyRoad,
      poolSize: 10,
    });

    let upHillSpawnerEntity = new Entity("up-hill-spawner");
    this.addChild(upHillSpawnerEntity);
    this.upHillSpawner = upHillSpawnerEntity.addScript(Spawner, {
      class: UpHill,
      poolSize: 10,
    });

    let downHillSpawnerEntity = new Entity("down-hill-spawner");
    this.addChild(downHillSpawnerEntity);
    this.downHillSpawner = downHillSpawnerEntity.addScript(Spawner, {
      class: DownHill,
      poolSize: 10,
    });

    let numberSpawnerEntity = new Entity("number-spawner");
    this.addChild(numberSpawnerEntity);
    this.numberSpawner = numberSpawnerEntity.addScript(Spawner, {
      class: CharacterFactory,
      poolSize: 10,
    });





    let SaladSpawnerEntity = new Entity("salad-spawner");
    this.addChild(SaladSpawnerEntity);
    this.saladSpawner = SaladSpawnerEntity.addScript(Spawner, {
      class: Salad,
      poolSize: 10,
    });

    let HotDogSpawnerEntity = new Entity("hotdog-spawner");
    this.addChild(HotDogSpawnerEntity);
    this.hotdogSpawner = HotDogSpawnerEntity.addScript(Spawner, {
      class: HotDog,
      poolSize: 10,
    });

    let ChesseSpawnerEntity = new Entity("chesse-spawner");
    this.addChild(ChesseSpawnerEntity);
    this.chesseSpawner = ChesseSpawnerEntity.addScript(Spawner, {
      class: Chesse,
      poolSize: 10,
    });
    let shitSpawnerEntity = new Entity("shit-spawner");
    this.addChild(shitSpawnerEntity);
    this.shitSpawner = shitSpawnerEntity.addScript(Spawner, {
      class: Shit,
      poolSize: 10,
    });

    let JumpStateSpawnerEntity = new Entity("jump-state-spawner");
    this.addChild(JumpStateSpawnerEntity);
    this.jumpStateSpawner = JumpStateSpawnerEntity.addScript(Spawner, {
      class: JumpState,
      poolSize: 2,
    });
    let JumpState2SpawnerEntity = new Entity("jump-state2-spawner");
    this.addChild(JumpState2SpawnerEntity);
    this.jumpState2Spawner = JumpState2SpawnerEntity.addScript(Spawner, {
      class: JumpState2,
      poolSize: 2,
    });
    let HandLeftSpawnerEntity = new Entity("hand-left-spawner");
    this.addChild(HandLeftSpawnerEntity);
    this.handLeftSpawner = HandLeftSpawnerEntity.addScript(Spawner, {
      class: HandLeft,
      poolSize: 5,
    });
    let OnionSpawnerEntity = new Entity("onion-spawner");
    this.addChild(OnionSpawnerEntity);
    this.onionSpawner = OnionSpawnerEntity.addScript(Spawner, {
      class: Onion,
      poolSize: 10,
    });
    let TheFaceSpawnerEntity = new Entity("the-face-spawner");
    this.addChild(TheFaceSpawnerEntity);
    this.theFaceSpawner = TheFaceSpawnerEntity.addScript(Spawner, {
      class: TheFace,
      poolSize: 10,
    });
    let AnotherBurgerSpawnerEntity = new Entity("another-burger-spawner");
    this.addChild(AnotherBurgerSpawnerEntity);
    this.anotherBurgerSpawner = AnotherBurgerSpawnerEntity.addScript(Spawner, {
      class: anotherBurgerItem,
      poolSize: 10,
    });
    let tableSpawnerEntity = new Entity("table-spawner");
    this.addChild(tableSpawnerEntity);
    this.tableSpawner = tableSpawnerEntity.addScript(Spawner, {
      class: table,
      poolSize: 10,
    });

    let manSpawnerEntity = new Entity('man-spawner');
    this.addChild(manSpawnerEntity);
    this.manSpawner = manSpawnerEntity.addScript(Spawner, {
      class: Man,
      poolSize: 10,
    });

    let endroad1Entity = new Entity('endroad1-spawner');
    this.addChild(endroad1Entity);
    this.endRoad1Spawner = endroad1Entity.addScript(Spawner, {
      class: endRoad1,
      poolSize: 10,
    });

    let endroad0Entity = new Entity('endroad0-spawner');
    this.addChild(endroad0Entity);
    this.endRoad0Spawner = endroad0Entity.addScript(Spawner, {
      class: endRoad0,
      poolSize: 10,
    });

    let curvedUpEntity = new Entity('curvedUp-spawner');
    this.addChild(curvedUpEntity);
    this.curvedUpSpawner = curvedUpEntity.addScript(Spawner, {
      class: curvedUp,
      poolSize: 5,
    });

    let curvedDownEntity = new Entity('curvedDown-spawner');
    this.addChild(curvedDownEntity);
    this.curvedDownSpawner = curvedDownEntity.addScript(Spawner, {
      class: curvedDown,
      poolSize: 5,
    });

    let HandRightSpawnerEntity = new Entity("hand-right-spawner");
    this.addChild(HandRightSpawnerEntity);
    this.handRightSpawner = HandRightSpawnerEntity.addScript(Spawner, {
      class: HandRight,
      poolSize: 5,
    });

    let ForkSpawnerEntity = new Entity("Fork");
    this.addChild(ForkSpawnerEntity);
    this.ForkSpawner = ForkSpawnerEntity.addScript(Spawner, {
      class: Fork,
      poolSize: 5,
    });

    let HobSpawnerEntity = new Entity("Hob");
    this.addChild(HobSpawnerEntity);
    this.HobSpawner = HobSpawnerEntity.addScript(Spawner, {
      class: Hob,
      poolSize: 5,
    });

    let hammerSpawnerEntity = new Entity("hammer");
    this.addChild(hammerSpawnerEntity);
    this.hammerSpawner = hammerSpawnerEntity.addScript(Spawner, {
      class: Hammer,
      poolSize: 5,
    });
    let RollingDoughEntity = new Entity("RollingDough");
    this.addChild(RollingDoughEntity);
    this.RollingDoughSpawner = RollingDoughEntity.addScript(Spawner, {
      class: RollingDough,
      poolSize: 5,
    });

    let knifeSpawnerEntity = new Entity("knife");
    this.addChild(knifeSpawnerEntity);
    this.knifeSpawner = knifeSpawnerEntity.addScript(Spawner, {
      class: Knife,
      poolSize: 5,
    });

    let gianEntity = new Entity("gian");
    this.addChild(gianEntity);
    this.gianSpawner = gianEntity.addScript(Spawner, {
      class: gian,
      poolSize: 12,
    });

    let upHillLowEntity = new Entity("upHillLow");
    this.addChild(upHillLowEntity);
    this.upHillLowSpawner = upHillLowEntity.addScript(Spawner, {
      class: UpHillLow,
      poolSize: 5,
    });

    let holeEntity = new Entity("hole");
    this.addChild(holeEntity);
    this.holeSpawner = holeEntity.addScript(Spawner, {
      class: Hole,
      poolSize: 5,
    });
    let DoorDecorEntity = new Entity("DoorDecor");
    this.addChild(DoorDecorEntity);
    this.DoorDecorSpawner = DoorDecorEntity.addScript(Spawner, {
      class: DoorDecor,
      poolSize: 2,
    });
    let DoorDecorUsEntity = new Entity("DoorDecor");
    this.addChild(DoorDecorUsEntity);
    this.DoorDecorUsSpawner = DoorDecorUsEntity.addScript(Spawner, {
      class: DoorDecorUs,
      poolSize: 2,
    });
    let DoorDecorWingEntity = new Entity("DoorDecor");
    this.addChild(DoorDecorWingEntity);
    this.DoorDecorWingSpawner = DoorDecorWingEntity.addScript(Spawner, {
      class: DoorDecorWing,
      poolSize: 2,
    });
    let dhlEntity = new Entity("DoorDecor");
    this.addChild(dhlEntity);
    this.dhlSpawner = dhlEntity.addScript(Spawner, {
      class: DownHillLow,
      poolSize: 5,
    });


    let Candy1Entity = new Entity("")
    this.addChild(Candy1Entity);
    this.candy1Spawner = Candy1Entity.addScript(Spawner, {
      class: Candy1,
      poolSize: 10,
    });

    let Candy3Entity = new Entity("")
    this.addChild(Candy3Entity);
    this.candy3Spawner = Candy3Entity.addScript(Spawner, {
      class: Candy3,
      poolSize: 10,
    });

    let Candy4Entity = new Entity("")
    this.addChild(Candy4Entity);
    this.candy4Spawner = Candy4Entity.addScript(Spawner, {
      class: Candy4,
      poolSize: 10,
    });


    let Candy5Entity = new Entity("")
    this.addChild(Candy5Entity);
    this.candy5Spawner = Candy5Entity.addScript(Spawner, {
      class: Candy5,
      poolSize: 10,
    });










  }
}
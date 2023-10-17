import { CollisionEvent } from "../../../physics/collissionEvent";
import { Script } from "../../../template/systems/script/script";
import { CollisionTag } from "../../../physics/collisionTag";
import { GameConstant } from "../../../gameConstant";
import { Tween } from "../../../template/systems/tween/tween";
import { Curve, Vec3 } from "playcanvas";
import { Util } from "../../../helpers/util";
import { SoliderManager } from "../../manager/soliderManager";
import { SpawningEvent } from "../spawners/spawningEvent";
import { MathOperator } from "../../obj/obstacles/mathWall/mathWall";
import { DataManager } from "../../data/dataManager";
import { LevelEndGameType } from "../../obj/level/level";
import { NumberBreak } from "../../obj/obstacles/characters/numberBreak";
import { UserData } from "../../data/userData";
import { SoundManager } from "../../../soundManager";
import { flame } from "../../obj/effect/fire";
import { Time } from "../../../template/systems/time/time";

export const PlayerState = Object.freeze({
  Idle: "idle",
  Move: "move",
  Jump: "jump",
  Fall: "fall",
  Die: "die",
  Attack: "attack",
  Win: "win",
  Lose: "lose",
  Uphill: "up-hill",
  Downhill: "down-hill",
  Bumpyroad: "bumpy-road",
});

export const PlayerEvent = Object.freeze({
  Win: "win",
  Fall: "fall",
  Lose: "lose",
  Eat: "eat",
  Hit: "hit",
  HitRedDamage: "hitreddamage",
  HitObstacle: "hitobstacle",
  HitSawBlade: "hitsawblade",
  Jump: "jump",
  HitFinishLine: "hitfinishline",
  FightToBigBoss: "fighttobigboss",
  MoveToSoliderBoss: "movetosoliderboss",
  FightToSoliderBoss: "fighttosoliderboss",
  Bumpy: "bumpy",
  CameraZoomOut: "goToMouth",
  goToMan: "goToMan",
  checkWinLose1: "onWinLv1",

});

export const PlayerController = Script.createScript({
  name: "playerController",
  attributes: {
    move: { default: null },
    collider: { default: null },
    swipeMovement: { default: null },
    soliderSpawner: { default: null },
    blockAreas: { default: [] },
  },

  initialize() {
    this.collider.on(CollisionEvent.OnCollide, this.onCollide, this);
    this.collider.on(CollisionEvent.NotCollide, this.notCollide, this);
    this.character = this.entity.parent.parent.character;
    this.player = this.entity.parent.parent;
    this.playScene = this.player.parent
    this.elements = this.entity.parent.elements
    this.reset();
    this.cameraZoom = false;
  },

  reset() {
    this.breaks?.forEach((element) => {
      element.destroy();
    });
    if (this.swipeMovement) {
      this.swipeMovement.enable();
      this.swipeMovement.reset();
    }
    this.breaks = [];
    this._value = this.entity.value;
    this.soliders?.forEach((element) => {
      element.fire(SpawningEvent.Despawn);
    });
    this.soliders = [];
    this.speed = GameConstant.GAME_SPEED;
    this.tweenIncreaseSpeed?.stop();
    this.state = PlayerState.Idle;

  },

  update() {
    if (this.state === PlayerState.Idle || this.state === PlayerState.Die || this.state === PlayerState.Jump || this.state === PlayerState.Win || this.state === PlayerState.Lose || this.state === PlayerState.Uphill || this.state === PlayerState.Downhill || this.state === PlayerState.Bumpyroad) {
      return;
      // }
      // if (this.numberGroupMoveSimulator()) {
      //   if (this.state !== PlayerState.Attack) {
      //     this.move.speed.set(0, 0, this.speed);
      //   }
      // } else {
      //   this.move.speed.set(0, -this.speed, this.speed);
      //   this.state = PlayerState.Fall;
      //   this.onFall();
    }

  },

  numberGroupMoveSimulator() {
    let nums = this.entity.number.elements;
    let count = 0;
    let check = false;
    for (let i = 0; i < nums.length; i++) {
      let pos = nums[i].getPosition();
      let isInsideRoad = this._insideRoads(pos);
      if (!isInsideRoad) {
        pos.y = GameConstant.PLAYER_POS_Y_DOWN;
        nums[i].setPosition(pos);
        count++;
        check = false;
      } else {
        pos.y = GameConstant.PLAYER_POS_Y;
        nums[i].setPosition(pos);
        check = true;
      }
    }
    if (count >= nums.length) {
      check = false;
    } else {
      check = true;
    }

    return check;
  },

  collisionWallSimulation(wall) {
    // wall.disable();
    let pos = this.entity.getPosition();
    let nums = this.entity.number.elements;
    let wallPos = wall.entity.parent.getPosition().clone();
    let wallSize = wall.entity.parent.getLocalScale().clone();
    let isLeft = pos.x > wallPos.x;
    let isRight = pos.x < wallPos.x;
    if (isLeft) {
      pos.x += nums.length * 0.25 * wallSize.z;
    }
    if (isRight) {
      pos.x -= nums.length * 0.25 * wallSize.z;
    }
    this.entity.setPosition(pos);
  },

  onCollide(other) {
    if (other.tag === CollisionTag.MapObject) {
      this.onCollideNumber(other);
    }
    else if (other.tag === CollisionTag.EndWall) {
      this.onCollideEndWall(other);
    } else if (other.tag === CollisionTag.BigBossStart) {
      this.moveToBigBoss(other);
    } else if (other.tag === CollisionTag.Boss) {
      this.fightBigBoss(other);
    } else if (other.tag === CollisionTag.SoliderBossStart) {
      this.moveToSoliderBoss(other);
    } else if (other.tag === CollisionTag.HeadWall) {
      this.collisionWallSimulation(other);
    } else if (other.tag === CollisionTag.RedDamage) {
      this.onCollideRedDamage(other);
    } else if (other.tag === CollisionTag.Jump) {
      this.jump(other);
    } else if (other.tag === CollisionTag.SawBlade) {
      this.onCollideSawBlade(other);
    } else if (other.tag === CollisionTag.FinishLine) {
      this.onCollideFinishLine(other);
    }
    else if (other.tag === CollisionTag.endRoad1) {
      this.goToMiddle(other);
    }
    else if (other.tag === CollisionTag.endRoad2) {
      this.goToMouth(other);
    }
    else if (other.tag === CollisionTag.bumpyRoad) {
      this.bumpy(other);
    }
    else if (other.tag === CollisionTag.upHillRoad) {
      this.upHill(other);
    }
    else if (other.tag === CollisionTag.UpHillLowRoad) {
      this.upHillLow(other);
    }
    else if (other.tag === CollisionTag.downHillRoad) {
      this.downHill(other);
    }
    else if (other.tag === CollisionTag.curvedUp) {
      this.curvedUp(other);
    }
    else if (other.tag === CollisionTag.man) {
      this.manOnEat(other)
    }
    else if (other.tag === CollisionTag.hand_left) {
      if (this.entity.parent !== this.player.character)
        this.hand_left(other);
      else {
        this.hand_left2(other);

      }
    }
    else if (other.tag === CollisionTag.fork) {
      this.forkDame(other)
    }
    else if (other.tag === CollisionTag.item) {
      this.onCollideItem(other);
    }
    else if (other.tag === CollisionTag.itemBurger) {
      this.onCollideAnotherBurger(other);
    }
    else if (other.tag === CollisionTag.table) {
      this.goToMan(other);
    }
    else if (other.tag === CollisionTag.hammer) {
      this.hammerDame(other)
    }
    else if (other.tag === CollisionTag.knife) {
      this.hammerDame(other)
    }
    else if (other.tag === CollisionTag.hob) {
      this.fireeeeee(other)
    }
    else if (other.tag === CollisionTag.RollingDough) {
      this.rollingDown(other)
    }



  },
  rollingDown(other) {
    // if (other.entity === this.entity.ignoreColission) {
    //   return
    // }
    // this.entity.ignoreColission = other.entity
    let curveY = new pc.Curve([
      0, other.entity.parent.getPosition().y,
      1, this.entity.parent.getPosition().y - 1
    ])
    let curveZ = new pc.Curve([
      0, other.entity.parent.getPosition().z,
      1, this.player.character.getPosition().z
    ])
    Tween.createCountTween({
      duration: 2,
      onUpdate: (dt) => {
        let pos = curveY.value(dt.percent);
        let posZ = curveZ.value(dt.percent)
        let tmpPos = other.entity.parent.getPosition();
        other.entity.parent.setPosition(tmpPos.x, pos, posZ);
      },
    }).start();

  },
  manOnEat(other) {
    other.entity.onEat = true

  },
  hammerDame(other) {
    if (other.entity === this.entity.ignoreColission) {
      return
    }
    this.entity.ignoreColission = other.entity
    this.character.hammerDame(this.entity.parent)
    if (this.character.abs.length <= 0) {
      this.player.parent.loseGame()
    }

  },
  forkDame(other) {
    if (other.entity === this.entity.ignoreColission) {
      return
    }
    this.entity.ignoreColission = other.entity

    this.entity.parent.forkDame()

  },
  fireeeeee(other) {
    if (other.entity === this.entity.ignoreColission) {
      return
    }
    this.entity.ignoreColission = other.entity
    if (this.entity.parent.onFire) return
    this.flame = new flame()
    this.entity.parent.flame = this.flame
    this.entity.parent.onFire = true
    this.flame.setLocalScale(0.5, 0.5, 0.5)
    this.entity.addChild(this.flame)
  },
  hand_left2(other) {
    if (this.player.character.abs.length <= 1) {
      this.player.move.disable()

      this.player.fire("disableSwipe")
      // this.swipeMovement.disable();
      // this.player.move.disable()
      other.entity.onCollide();
      other.entity.trapHand()
      this.character.hand_left(this.entity.parent)

      // set cho burger trở về vị trí ban đầu vì khi nhảy mà va chạm với tay thì vị trí sẽ bị  sai

      // rồi set vị trí các lát burger về vị trí đúng bàn tay
      this.entity.parent.elements.forEach(element => {
        element.setLocalPosition(0, element.getLocalPosition().y - 0.5, 1)
      });


      if (this.entity.script) {
        this.entity.script.destroy("folowPrev2")
      }
      other.entity.palm.addChild(this.entity.parent)
      this.entity.parent.setLocalScale(100, 100, 100)
      Tween.createCountTween({
        duration: 3,
        onComplete: () => {
          this.player.addChild(this.entity.parent)
          this.entity.parent.elements.forEach(element => {
            element.setLocalPosition(0, 0, 0)
          });
          this.entity.parent.setLocalScale(1, 1, 1)
          other.entity.wavingHand()
        }
      }).start()
      this.state = PlayerState.Lose;
      this.player.parent.loseGame()
      this.player.anotherB.pop()

    }
    else {

      this.temp = this.player.character.abs[1]
      // this.swipeMovement.disable();
      // this.player.move.disable()
      other.entity.onCollide();
      other.entity.trapHand()
      this.character.hand_left(this.temp)

      // set cho burger trở về vị trí ban đầu vì khi nhảy mà va chạm với tay thì vị trí sẽ bị  sai

      // rồi set vị trí các lát burger về vị trí đúng bàn tay
      this.temp.elements.forEach(element => {
        element.setLocalPosition(0, element.getLocalPosition().y - 0.5, 1)
      });


      if (this.temp.elements[0].script) {
        this.temp.elements[0].script.destroy("folowPrev2")
      }
      other.entity.palm.addChild(this.temp)
      this.temp.setLocalScale(100, 100, 100)
      this.state = PlayerState.Lose;
      Tween.createCountTween({
        duration: 3,
        onComplete: () => {
          this.player.addChild(this.temp)
          this.temp.setLocalPosition(0, 0, 0)
          this.temp.fire(SpawningEvent.Despawn)
          other.entity.wavingHand()
        }
      }).start()
      this.player.anotherB.pop()

    }

  },
  hand_left(other) {

    // this.swipeMovement.disable();
    // this.player.move.disable()
    other.entity.onCollide();
    other.entity.trapHand()
    this.character.hand_left(this.entity.parent)

    // set cho burger trở về vị trí ban đầu vì khi nhảy mà va chạm với tay thì vị trí sẽ bị  sai

    // rồi set vị trí các lát burger về vị trí đúng bàn tay
    this.entity.parent.elements.forEach(element => {
      element.setLocalPosition(0, element.getLocalPosition().y - 0.5, 1)
    });


    if (this.entity.script) {
      this.entity.script.destroy("folowPrev2")
    }
    other.entity.palm.addChild(this.entity.parent)
    this.entity.parent.setLocalScale(100, 100, 100)
    this.state = PlayerState.Lose;
    if (this.entity.parent === this.character.abs[0]) {
      this.player.parent.loseGame()
    }
    Tween.createCountTween({
      duration: 3,
      onComplete: () => {
        this.player.addChild(this.entity.parent)
        this.entity.parent.setLocalPosition(0, 0, 0)
        this.entity.parent.fire(SpawningEvent.Despawn)
        other.entity.wavingHand()
      }
    }).start()
    // this.entity.fire(PlayerEvent.Lose)
    this.playScene.playScreen.loadingPlay.fire('increase', -1 / this.playScene.level.anotherBGs.length)

    this.player.anotherB.pop()

  },
  goToMouth(other) {
    other.entity.onCollide();
    this.state = PlayerState.Uphill;
    let curve = other.entity.curve;
    let distanceJump = 15;
    let targetPos = this.entity.getPosition().clone().add(new Vec3(0, 0, distanceJump));
    let distance = targetPos.clone().sub(this.entity.getPosition()).length();
    let duration = distance / GameConstant.GAME_SPEED;
    Tween.createCountTween({
      duration,
      onUpdate: (dt) => {
        let pos = curve.value(dt.percent);
        let tmpPos = this.entity.parent.getPosition();
        this.entity.parent.setPosition(tmpPos.x, pos, tmpPos.z);
      },
      onComplete: () => {
        this.player.move.disable()
        this.player.fire(PlayerEvent.Win)
        // this.player.fire(SpawningEvent.Despawn);
      }
    }).start();
    // Tween.createRotateTween(this.entity, new Vec3(-360, 0, 0), {
    //   duration,
    // }).start();
  },



  goToMiddle(other) {
    if (other.entity === this.entity.ignoreColission) {
      return
    }
    this.entity.ignoreColission = other.entity
    this.player.fire(PlayerEvent.CameraZoomOut)
    // this.entity.parent.onCollide();
    let curve1 = new pc.Curve([
      0, this.entity.getLocalPosition().x,
      1, 0])
    Tween.createCountTween({
      duration: 0.5,
      onUpdate: (dt) => {
        let pos = curve1.value(dt.percent);
        let tmpPos = this.entity.getLocalPosition();
        this.entity.setLocalPosition(pos, tmpPos.y, tmpPos.z);
      },
    }).start();
  },

  goToMan(other) {

    if (this.entity.parent !== this.player.character)
      this.entity.parent.follow2.disable()
    if (this.entity.parent === this.character.abs[this.character.abs.length - 1]) {
      this.player.fire(PlayerEvent.goToMan)
    }
    if (this.entity.parent === this.character.abs[0]) {

      this.player.move.disable()
      let duration = 3
      Tween.createCountTween({
        duration,
        onComplete: () => {
          this.player.fire(PlayerEvent.checkWinLose1, other.entity.getPosition().z, other.entity.getPosition().x, other.entity)
          this.tween.stop()
        }

      }).start();
    }
    //this.player.fire(PlayerEvent.goToMouth)
    this.entity.parent.onCollide();
    other.entity.onCollide()
    let curveY = new pc.Curve([
      0, 0,
      0.15, this.entity.parent.getPosition().y + 3,
      0.3, other.entity.getPosition().y + 1.5,
      1, other.entity.getPosition().y + 1.5,
    ])
    let curveX = new pc.Curve([
      0, this.entity.parent.getPosition().x,
      0.3, other.entity.getPosition().x,
      1, other.entity.getPosition().x,
    ])
    let curveZ = new pc.Curve([
      0, this.entity.parent.getPosition().z,
      0.3, other.entity.getPosition().z,
      1, other.entity.getPosition().z,
    ])
    let duration = 6
    this.tween = Tween.createCountTween({
      duration,
      onUpdate: (dt) => {

        let posX = curveX.value(dt.percent);
        let posY = curveY.value(dt.percent);
        let posZ = curveZ.value(dt.percent);

        this.entity.parent.setPosition(posX, posY, posZ);
      },
      onComplete: () => {
        this.player.move.disable()
      }

    }).start();

  },

  onCollideItem(other) {

    if (other.entity === this.entity.ignoreColissioItem) {
      return
    }
    this.entity.ignoreColissioItem = other.entity
    SoundManager.play("sfx_game_collect_items_02")
    this.entity.parent.updateValue(other.entity.itemValue)
    other.entity.onCollide();
    this.player.items.push(other.entity)
    //this.runSplashFx()
    this.player.itemPoints++
    if (DataManager.currentLevel % 2 === 0) {
      if (other.entity.name === 'shit') {
        this.player.itemPoints--
        this.playScene.playScreen.loadingPlay.fire('increase', -1 / this.playScene.level.itemPoins.length)
      }
      else {
        this.playScene.playScreen.loadingPlay.fire('increase', 1 / this.playScene.level.itemPoins.length)

      }
    }

  },

  onCollideAnotherBurger(other) {
    SoundManager.play("sfx_game_collect_items")

    other.entity.parent.onCollide();
    this.entity.parent.addAnotherBurger(other.entity)
    this.player.anotherB.push(other.entity)
    this.playScene.playScreen.loadingPlay.fire('increase', 1 / this.playScene.level.anotherBGs.length)

  },

  onCollideNumber(other) {
    if (this._value >= other.entity.value) {
      this._value += other.entity.value;
      this.eat(other.entity);
      this.entity.onEat();
      this.fire(PlayerEvent.Hit, other.entity);
    } else {
      this.onDie();
      other.disable();
    }
  },

  onCollideEndWall(other) {
    if (this.state === PlayerState.Win) {
      other.disable();
      if (this._value <= other.entity.value) {
        this.move.disable();
        this.fire(PlayerEvent.HitObstacle);
        this.tweenIncreaseSpeed?.stop();
        this.onWinWhenFightBigBoss();
      } else {
        other.entity.onCollide();
      }
    } else {
      this.calculateByOperator(other);
      if (this._value > 0) {
        this.eat(other.entity);
      } else {
        this.onDie();
        other.disable();
      }
    }
  },

  onCollideFinishLine(other) {
    other.disable();
    let endType = DataManager.getEndLevelType();
    this.fire(PlayerEvent.HitFinishLine);
    this.speed = GameConstant.GAME_SPEED * 3;
    switch (endType) {
      case LevelEndGameType.BigBoss:
        break;
      case LevelEndGameType.SoliderBoss:
        break;
      default:
        this.state = PlayerState.Win;
        Tween.createLocalTranslateTween(this.entity, { x: 0 }, {
          duration: 1,
        }).start();
        this.swipeMovement.disable();
        break;
    }
    this.tweenIncreaseSpeed = Tween.createCountTween({
      duration: 1,
      loop: true,
      onUpdate: () => {
        this.speed += 0.1;
        this.move.speed.set(0, 0, this.speed);
      }
    }).start();
  },

  onCollideSawBlade(other) {
    this._value -= other.entity.parent.controller.damage;
    this.fire(PlayerEvent.HitSawBlade);
    if (this._value <= 0) {
      this.onDie();
    } else {
      this.eat(other.entity.parent);
    }
  },

  calculateByOperator(other) {
    let operator = other.entity.operator;
    let value = other.entity.value;
    switch (operator) {
      case MathOperator.ADD:
        this._value += value;
        break;
      case MathOperator.SUB:
        this._value -= value;
        break;
      case MathOperator.MUL:
        this._value = Math.floor(this._value * value);
        break;
      case MathOperator.DIV:
        this._value = Math.floor(this._value / value);
        break;
      default:
        break;
    }
  },
  upHill(other) {
    if (other.entity === this.entity.ignoreColission) {
      return
    }
    this.entity.ignoreColission = other.entity
    this.player.fire("upHill")

    other.entity.onCollide();
    this.state = PlayerState.Uphill;
    // let curve = other.entity.curve;
    let curve = new pc.Curve([
      0, this.entity.parent.getLocalPosition().y,
      1, other.entity.getLocalPosition().y,
    ])

    let distanceJump = (other.entity.getLocalPosition().y - this.entity.parent.getLocalPosition().y) * 3;
    // let targetPos = this.entity.getPosition().clone().add(new Vec3(0, 0, distanceJump));
    // let distance = targetPos.clone().sub(this.entity.getPosition()).length();
    let duration = distanceJump / GameConstant.GAME_SPEED;

    Tween.createCountTween({
      duration,
      onUpdate: (dt) => {
        let pos = curve.value(dt.percent);
        let tmpPos = this.entity.parent.getLocalPosition();
        this.entity.parent.setLocalPosition(tmpPos.x, pos, tmpPos.z);
      },

    }).start();
  },
  upHillLow(other) {
    if (other.entity === this.entity.ignoreColission) {
      return
    }
    this.entity.ignoreColission = other.entity
    if (this.state === PlayerState.Uphill) {
      return
    }
    other.entity.onCollide();
    this.state = PlayerState.Uphill;
    // let curve = other.entity.curve;
    let curve = new pc.Curve([
      0, this.entity.parent.getLocalPosition().y,
      1, other.entity.targetPos,
    ])
    let distanceJump = Math.sqrt(((other.entity.targetPos - this.entity.parent.getLocalPosition().y) * 4) ** 2 + (other.entity.targetPos - this.entity.parent.getLocalPosition().y) ** 2);
    // let targetPos = this.entity.getPosition().clone().add(new Vec3(0, 0, distanceJump));
    // let distance = targetPos.clone().sub(this.entity.getPosition()).length();
    let duration = distanceJump / GameConstant.GAME_SPEED;
    Tween.createCountTween({
      duration,
      onUpdate: (dt) => {
        let pos = curve.value(dt.percent);
        let tmpPos = this.entity.parent.getLocalPosition();
        this.entity.parent.setLocalPosition(tmpPos.x, pos, tmpPos.z);
      },
      onComplete: (dt) => {
        this.state = PlayerState.Move;
      }

    }).start();
  },
  bumpy(other) {
    if (other.entity === this.entity.ignoreColission) {
      return
    }

    this.entity.ignoreColission = other.entity
    this.player.fire(PlayerEvent.Bumpy)
    // other.entity.onCollide();
    this.state = PlayerState.Downhill;
    let curve = other.entity.curve;
    let distanceJump = 10;
    let targetPos = this.entity.getPosition().clone().add(new Vec3(0, 0, distanceJump));
    let distance = targetPos.clone().sub(this.entity.getPosition()).length();
    let duration = distance / GameConstant.GAME_SPEED;
    Tween.createCountTween({
      duration,
      onUpdate: (dt) => {
        let pos = curve.value(dt.percent);
        let tmpPos = this.entity.parent.getPosition();
        this.entity.parent.setPosition(tmpPos.x, pos, tmpPos.z);
      },
      // onComplete: () => {
      //   Tween.createLocalTranslateTween(this.entity, { y: "+0.3" }, {
      //     duration: 0.05,
      //     repeat: 1,
      //     yoyo: true,
      //     onComplete: () => {
      //       this.state = PlayerState.Move;
      //     }
      //   }).start();
      // }
    }).start();
    // Tween.createRotateTween(this.entity, new Vec3(-360, 0, 0), {
    //   duration,
    // }).start();

  },
  curvedUp(other) {
    if (other.entity === this.entity.ignoreColission) {
      return
    }
    this.entity.ignoreColission = other.entity
    other.entity.onCollide();
    this.state = PlayerState.Downhill;
    // let curve = other.entity.curve;
    let curve = new pc.Curve([
      0, this.entity.parent.getLocalPosition().y,
      0.5, this.entity.parent.getLocalPosition().y + 1.5,
      1, other.entity.getLocalPosition().y,
    ])
    let distanceJump = 13;
    let targetPos = this.entity.getPosition().clone().add(new Vec3(0, 0, distanceJump));
    let distance = targetPos.clone().sub(this.entity.getPosition()).length();
    let duration = distance / GameConstant.GAME_SPEED;
    Tween.createCountTween({
      duration,
      onUpdate: (dt) => {
        let pos = curve.value(dt.percent);
        let tmpPos = this.entity.parent.getLocalPosition();
        this.entity.parent.setLocalPosition(tmpPos.x, pos, tmpPos.z);
      },

    }).start();
  },
  downHill(other) {
    if (other.entity === this.entity.ignoreColission) {
      return
    }
    this.entity.ignoreColission = other.entity
    other.entity.onCollide();
    if (this.state === PlayerState.Downhill)
      return
    this.state = PlayerState.Downhill;
    // let curve = other.entity.curve;
    let curve = new pc.Curve([
      0, this.entity.parent.getLocalPosition().y,
      1, other.entity.getLocalPosition().y,
    ])
    let distanceJump = (this.entity.parent.getLocalPosition().y - other.entity.getLocalPosition().y) * 3
    let targetPos = this.entity.getPosition().clone().add(new Vec3(0, 0, distanceJump));
    let distance = targetPos.clone().sub(this.entity.getPosition()).length();
    let duration = distance / GameConstant.GAME_SPEED;
    Tween.createCountTween({
      duration,
      onUpdate: (dt) => {
        let pos = curve.value(dt.percent);
        let tmpPos = this.entity.parent.getLocalPosition();
        this.entity.parent.setLocalPosition(tmpPos.x, pos, tmpPos.z);
      },
      onComplete: () => {
        this.state = PlayerState.Move
      }

    }).start();
  },

  jump(other) {

    if (other.entity === this.entity.ignoreColission) {
      return
    }
    this.entity.ignoreColission = other.entity
    if (this.state === "jump") {
      return
    }
    this.state = "jump"
    SoundManager.play("sfx_game_jump_pad")
    if (other.entity.name !== 'fo' && other.entity.completeTweenJump) {
      other.entity.completeTweenJump = false
      Tween.createLocalTranslateTween(other.entity, { y: "-0.8" }, {
        duration: 0.1,
        repeat: 1,
        yoyo: true,
        onComplete: () => {
          other.entity.completeTweenJump = true
        }
      }).start();
    }

    // other.entity.onCollide();
    this.state = PlayerState.Jump;
    // this.fire(PlayerEvent.Jump);
    let curve = new pc.Curve(
      [
        0, this.entity.parent.getLocalPosition().y,
        0.5, this.entity.parent.getLocalPosition().y + 3.5,
        1, this.entity.parent.getLocalPosition().y,

      ]
    );

    let distanceJump = 16;
    // let targetPos = this.entity.getPosition().clone().add(new Vec3(0, 0, distanceJump));
    // let distance = targetPos.clone().sub(this.entity.getPosition()).length();
    let duration = distanceJump / GameConstant.GAME_SPEED;
    Tween.createCountTween({
      duration,
      onUpdate: (dt) => {
        let pos = curve.value(dt.percent);
        let tmpPos = this.entity.parent.getLocalPosition();
        this.entity.parent.setLocalPosition(tmpPos.x, pos, tmpPos.z);
      },
      onComplete: () => {
        this.state = PlayerState.Move
        Tween.createLocalTranslateTween(this.entity.parent, { y: "+0.3" }, {
          duration: 0.05,
          repeat: 1,
          yoyo: true,
          onComplete: () => {
            this.state = PlayerState.Move;
          }
        }).start();
      }
    }).start();
    // Tween.createRotateTween(this.entity.parent, new Vec3(-360, 0, 0), {
    //   duration,
    // }).start();
  },

  onCollideRedDamage(other) {
    this.state = PlayerState.Attack;
    let damage = other.entity.controller.damage;
    let value = other.entity.value;
    let speed = (damage / value) * other.entity.controller.size;
    speed /= 0.03;
    this.move.speed.set(0, 0, speed);
    other.entity.off(SpawningEvent.Despawn, this.onRedDamageAttacked, this);
    other.entity.once(SpawningEvent.Despawn, this.onRedDamageAttacked, this);
    this._value -= other.entity.controller.damage;
    if (this._value <= 0) {
      this.onDie();
    } else {
      this.fire(PlayerEvent.HitRedDamage, other.entity);
      this.eat(other.entity);
    }
  },

  onRedDamageAttacked(red) {
    this.move.speed.set(0, 0, GameConstant.GAME_SPEED);
    this.state = PlayerState.Move;
  },

  moveToSoliderBoss(other) {
    other.disable();
    this.state = PlayerState.Idle;
    this.move.disable();
    this.swipeMovement.disable();
    this.tweenIncreaseSpeed?.stop();

    this.fire(PlayerEvent.MoveToSoliderBoss);
    let targetPos = other.entity.parent.numberGroup.getPosition().clone().sub(new pc.Vec3(0, 0, 8));
    Tween.createLocalTranslateTween(this.entity, targetPos, {
      duration: 1,
      onComplete: () => {
        other.entity.parent.onFight();
        this.spawnFlowerMode(other.entity.parent);
        this.entity.number.enabled = false;
      }
    }).start();
  },

  spawnFlowerMode(target) {
    const numberPos = target.numberGroup.getLocalPosition().clone().sub(new Vec3(0, 0, 10));
    const angleStep = (2 * Math.PI) / this._value;
    let maxDistance = 0.2 / (2 * (Math.PI / this._value));
    maxDistance = Math.min(maxDistance, 6);
    for (let i = 0; i < this._value; i++) {
      var angle = i * angleStep;
      var distance = Util.random(0, maxDistance);
      var x = numberPos.x + distance * Math.cos(angle);
      var z = numberPos.z + distance * Math.sin(angle);
      var pos = new Vec3(x, numberPos.y, z);
      while (this.isPositionDuplicate(pos)) {
        distance = Util.random(0, maxDistance);
        x = numberPos.x + distance * Math.cos(angle);
        z = numberPos.z + distance * Math.sin(angle);
        pos = new Vec3(x, numberPos.y, z);
      }
      let solider = this.soliderSpawner.spawn();
      solider.setLocalPosition(numberPos);
      solider.setTarget(pos);
      target.addChild(solider);
      solider.scaleUp();
      SoliderManager.instance.addSoliderPlayer(solider);
      this.soliders.push(solider);
    }
  },

  isPositionDuplicate(pos) {
    for (let i = 0; i < this.soliders.length; i++) {
      if (this.soliders[i].getPosition().equals(pos)) {
        return true;
      }
    }
    return false;
  },

  moveToBigBoss(other) {
    other.disable();
    this.state = PlayerState.Idle;
    this.move.disable();
    this.tweenIncreaseSpeed?.stop();
    this.swipeMovement.disable();
    let targetPos = other.entity.parent.numberGroup.getPosition();
    Tween.createLocalTranslateTween(this.entity, targetPos, {
      duration: 1,
    }).start();
  },

  fightBigBoss(other) {
    let boss = other.entity.parent;
    boss.onCollide();
    if (this._value > other.entity.value) {
      this.onWinWhenFightBigBoss();
      boss.onLose();
    } else {
      boss.onWin();
      this.onLose();
    }
  },

  onWinWhenFightBigBoss() {
    this.fire(PlayerEvent.FightToBigBoss);
    Tween.createLocalTranslateTween(this.entity, {
      z: "-3", x: 0,
    }, {
      easing: Tween.Easing.Quadratic.Out,
      duration: 0.7
    }).start();
    this.tweenRotate = Tween.createRotateTween(this.entity, {
      x: 12, y: 720, z: 0,
    }, {
      duration: 1,
      onComplete: () => {
        this.onWin();
      }
    }).start();
  },

  eat(entity) {
    entity.onCollide();
    this.updateValue(this._value);
    this.fire(PlayerEvent.Eat, this._value);
  },

  onDie() {
    this.state = PlayerState.Die;
    this.move.disable();
    this.tweenIncreaseSpeed?.stop();
    this.swipeMovement.disable();
    this.collider.disable();
    this.spawnBreakNumber();
    this.fire(PlayerEvent.Lose);
  },

  spawnBreakNumber() {
    let nums = this.entity.number.elements;
    for (let i = 0; i < nums.length; i++) {
      let number = nums[i];
      let pos = number.getLocalPosition();
      let rot = number.getLocalEulerAngles();
      let scale = number.getLocalScale();
      let value = nums[i].value;
      let numberBreak = new NumberBreak(parseInt(value));
      this.entity.number.addChild(numberBreak);
      this.breaks.push(numberBreak);
      numberBreak.setLocalPosition(pos);
      numberBreak.setLocalEulerAngles(rot);
      numberBreak.setLocalScale(scale);
      numberBreak.updateMaterial(number.model.meshInstances[0].material);
      numberBreak.objectBreak.play();
      number.fire(SpawningEvent.Despawn);
    }
  },

  onLose() {
    this.state = PlayerState.Lose;
    this.spawnBreakNumber();
    this.fire(PlayerEvent.Lose);
  },

  onWin() {
    this.state = PlayerState.Win;
    this.reduceOnWin();
    this.fire(PlayerEvent.Win);
  },

  // updateValue(value) {
  //   this._value = value;
  //   this.entity.updateValue(value);
  // },

  _insideRoads(pos) {
    for (var i = 0; i < this.blockAreas.length; i++) {
      if (this.blockAreas[i].orientedBox.containsPoint(pos)) {
        return true;
      }
    }
    return false;
  },

  reduceOnWin() {
    let valueStep = this._value * UserData.income / GameConstant.TOTAL_MONEY_SPAWN;
    let t = 0;
    Tween.createTween({ value: this._value }, {
      value: 0,
    }, {
      duration: 2,
      onUpdate: (dt) => {
        t = this._value - dt.value;
        if (t >= valueStep) {
          t = 0;
          this.updateValue(Math.floor(dt.value));
        } else if (dt.value < valueStep) {
          this.updateValue(Math.floor(dt.value));
        }
      }
    }).start();
  },

  onStart() {
    this.state = PlayerState.Move;

    this.player.move.enable();
  },

  onFall() {
    this.state = PlayerState.Die;
    this.fire(PlayerEvent.Fall);
    this.tweenIncreaseSpeed?.stop();
  },

  notCollide(other) {

  }
});
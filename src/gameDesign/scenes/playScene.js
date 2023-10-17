import { Scene } from "../../template/scene/scene";
import { GameConstant } from "../../gameConstant";
import { Entity, LIGHTTYPE_DIRECTIONAL, Vec3 } from "playcanvas"
import { Player } from "../obj/player/player";
import { Util } from "../../helpers/util";
import { CameraController, cameraEvent } from "../script/controller/cameraController";
import { PlayScreen, PlayScreenEvent } from "../ui/screens/playScreen";
import { InputHandler, InputHandlerEvent } from "../script/input/inputHandler";
import { DataManager } from "../data/dataManager";
import { Level } from "../obj/level/level";
import { EndWallEvent } from "../obj/obstacles/wall/endWall";
import { BigBossEvent } from "../obj/boss/bigBoss";
import { LevelController } from "../script/controller/levelController";
import { UserData } from "../data/userData";
import { SwipeMovement } from "../script/input/swipeMovement";
import { PlayerController, PlayerEvent } from "../script/controller/playerController";
import { TutorialScreen } from "../ui/screens/tutorialScreen";
import { TutorialScreenEvent } from "../ui/screens/tutorialScreen";
import { GameManager, GameManagerEvent } from "../../template/gameManager";
import { WinScreen } from "../ui/screens/winScreen";
import { WinScreenEvent } from "../ui/screens/winScreen";
import { Game } from "../../game";
import { Tween } from "../../template/systems/tween/tween";
import { LoseScreen, LoseScreenEvent } from "../ui/screens/loseScreen";
import { SoundManager } from "../../soundManager";
import { SpawningEvent } from "../script/spawners/spawningEvent";
import { AdsManager } from "../../../adSdk/adsManager";
import { AdVideoConfig, AdVideoType } from "../../../adSdk/adsConstant";
import { PopupScreen } from "../../template/ui/popup";
import { SettingScreen, SettingScreenEvent } from "../ui/screens/settingScreen";
import { Time } from "../../template/systems/time/time";
import { GameState, GameStateManager } from "../../template/gameStateManager";
export const PlaySceneEvent = Object.freeze({
    LevelLoaded: "levelLoaded",
});
export class PlayScene extends Scene {
    constructor() {
        super(GameConstant.SCENE_PLAY);
    }
    create() {
        super.create();
        this.ui.addScreens(
            new PlayScreen(),
            new TutorialScreen(),
            new WinScreen(),
            new LoseScreen(),
            new SettingScreen(),
        );
        this.playScreen = this.ui.getScreen(GameConstant.SCREEN_PLAY);
        this.tutorialScreen = this.ui.getScreen(GameConstant.SCREEN_TUTORIAL);
        this.winScreen = this.ui.getScreen(GameConstant.SCREEN_WIN);
        this.loseScreen = this.ui.getScreen(GameConstant.SCREEN_LOSE);
        this.settingScreen = this.ui.getScreen(GameConstant.SCREEN_SETTING);

        this._initialize();

        // This event will be called when the game is completed (win level or something like that).
        this._registerPlayScreenEvents();
        this._registerTutorialScreenEvents();
        this._registerWinScreenEvents();
        this._registerLoseScreenEvents();
        this._registerSettingScreenEvents();

        this.ui.setScreenActive(GameConstant.SCREEN_PLAY);
        this.ui.setScreenActive(GameConstant.SCREEN_TUTORIAL);
        this.tutorialScreen.play()
        this.tutorialScreen.on(TutorialScreenEvent.OnTapBackground, this._onStart, this);
        // this.ui.setScreenActive(GameConstant.SCREEN_WIN);
        // this.winScreen.play()

    }

    _onStart() {
        if (GameConstant.DEBUG_CAMERA) {
            return;
        }
        this.cameraController.enable();
        GameStateManager.state = GameState.Playing;

        this.ui.setScreenActive(GameConstant.SCREEN_TUTORIAL, false);
        this.gameManager.start();
        this.player.onStart();
    }

    _initInputHandler() {
        let inputHandlerEntity = new pc.Entity("input");
        this.inputHandler = inputHandlerEntity.addScript(InputHandler);
        // this.inputHandler.enabled = false;
        this.addChild(inputHandlerEntity);
    }
    _initGameManager() {
        let gameManagerEntity = new pc.Entity("game_manager");
        this.addChild(gameManagerEntity);

        this.gameManager = gameManagerEntity.addScript(GameManager);
        this.gameManager.on(GameManagerEvent.Start, this.inputHandler.enable, this.inputHandler);
        this.gameManager.on(GameManagerEvent.Lose, this._onLose, this);
        this.gameManager.on(GameManagerEvent.Lose, this.inputHandler.disable, this.inputHandler);
        this.gameManager.on(GameManagerEvent.Win, this._onWin, this);
        this.gameManager.on(GameManagerEvent.Win, this.inputHandler.disable, this.inputHandler);
    }

    _onWin() {
        GameStateManager.state = GameState.Win;
    }
    nextLevel() {
        this._onNextLevel();
    }
    replay() {
        this._onReplayLevel()
        //console.log
    }
    _onReplayLevel() {
        Game.replay();
        this.loseScreen.stop();
        // this.sfxGameWin.stop();
        this.respawnLevel();
    }
    _onNextLevel() {
        // DataLocal.updateDataByKey(GameConstant.INDEXEDDB_CURRENCY_KEY, UserData.currency);
        DataManager.nextLevel();
        Game.replay();
        this.winScreen.stop();

        //this.sfxGameWin.stop();
        this.respawnLevel();
    }

    respawnLevel() {

        this.level.reset();
        this.onRespawnLevel();



        let levelData = DataManager.getLevelData();
        this.level.config(levelData);
        // if (DataManager.currentLevel % 2 !== 0) {
        this.playScreen.loadingPlay.reset()
        this.playScreen.loadingPlay.enabled = true
        this.playScreen.smileIcon.enabled = true
        this.playScreen.wowIcon.enabled = true
        this.playScreen.cryIcon.enabled = true
        this.playScreen.loadingPlay.reset()
        // }
        this.level.generate(levelData.levelData);
        this.level.configUpHill()
        //this.registerSoliderManagerEvents();
        this.registerLevelEvents();
        //   this.updateUserData();
        this._initfigure()

        this.reInitPlayer();
        this.cameraWhenEnd = false
    }
    reInitPlayer() {
        this.cameraController.stopFollow = false
        // this.removeChild(this.player)
        // // this.player.fire()
        // this.player.children.forEach(item => {
        //     item.destroy()
        // })
        // this.player.destroy()
        // this.player.fire(SpawningEvent.Despawn)
        //   this._initPlayer()
        // this.cameraController.target = this.player
        // this.initPlayerEvent()

        // this.cameraController.target = this.player

        let playerPos = DataManager.getLevelData().playerPos;
        this.player.move.disable();
        // this.player.controller.updateValue(UserData.startNumber);
        this.player.character.setLocalPosition(0, 0, 0)
        this.player.setLocalPosition(playerPos.x, GameConstant.PLAYER_POS_Y, playerPos.z);
        this.player.character.setLocalPosition(0, 0, 0);

        this.level.controller.onStart();
        // this.player.controller.blockAreas = this.level.roadBlockAreas;
        // this.player.controller.swipeMovement.blockAreas = this.level.wallBlockAreas;
        this.cameraController.stopFollow = false
        this.player.reset();
        this._initfigure()
        this.swipeMovement.enable()
        this.resetCamera();


    }
    resetCamera() {
        this.mainCamera.setLocalPosition(0.122, 9.113, -13.521);
        this.mainCamera.setLocalEulerAngles(154.2, 0.6, 180);
        this.cameraController.offset = this.mainCamera.getPosition().clone();
    }

    onRespawnLevel() {
        //this.musicBg.stop();
        this.ui.disableAllScreens();
        this.playScreen.updateLevelText(DataManager.currentLevel);
        this.ui.setScreenActive(GameConstant.SCREEN_PLAY);
        this.ui.setScreenActive(GameConstant.SCREEN_TUTORIAL);
        //  this.musicBg.play();
        // SoliderManager.instance.clear();
        // BlockAreaManager.instance.clear();
        this.cameraController.enable();
    }
    _registerLoseScreenEvents() {
        this.loseScreen.on(LoseScreenEvent.ButtonTryAgainClicked, this.replay, this);
    }

    _registerSettingScreenEvents() {
        this.settingScreen.on(SettingScreenEvent.Close, this._onCloseSetting, this);
    }

    _registerWinScreenEvents() {
        this.winScreen.on(WinScreenEvent.ButtonContinueClicked, this.nextLevel, this);
    }

    _registerTutorialScreenEvents() {
        this.tutorialScreen.on(TutorialScreenEvent.ButtonStartNumberClicked, () => {
            this.upgradePlayerStartNumber();
            this.updateUserData();
        });
        this.tutorialScreen.on(TutorialScreenEvent.ButtonIncomeClicked, () => {
            this.upgradePlayerIncome();
            this.updateUserData();
        });
    }
    update(dt) {
        super.update(dt);

    }

    _onCloseSetting() {
        this.ui.setScreenActive(GameConstant.SCREEN_SETTING, false);
        Time.scale = 1;
    }

    _openSetting() {
        this.ui.setScreenActive(GameConstant.SCREEN_SETTING);
        if (GameStateManager.state === GameState.Playing) {
            Time.scale = 0;
        }
    }

    _initialize() {
        //set up event with mouse, keyboard
        this.ran = Util.random(1, 2)

        this._initInputHandler()
        this._initLight();
        this._initPlayer();
        this._initCamera();
        this._initLevel();

        this.initPlayerEvent()
        this._initGameManager();
        this._initfigure();

        // this._initCameraFollow();
    }
    _initCameraController() {
        this.cameraController = this.mainCamera.addScript(CameraController, {
            target: this.player,
            speed: 3,
            offset: this.mainCamera.getPosition().clone(),
            limitX: GameConstant.CAMERA_LIMIT_X,
            pos: this.mainCamera.getPosition().clone(),
        });
    }
    _initCamera() {

        this.mainCamera = new pc.Entity();
        this.addChild(this.mainCamera);
        this.mainCamera.addComponent("camera", {
            clearColor: Util.createColor(175, 233, 255),
            farClip: 1000,
            fov: 60,
            nearClip: 0.1,
            type: pc.PROJECTION_PERSPECTIVE,
            frustumCulling: false,
        });
        // this.mainCamera.setLocalPosition(5, 10, -10);
        // this.mainCamera.setLocalEulerAngles(-30, 180, 0);
        // this.mainCamera.setLocalPosition(0, 10, 10);
        // this.mainCamera.setLocalEulerAngles(-40, 0, 0);
        this.mainCamera.setLocalPosition(0, 9.113, -13.521);
        this.mainCamera.setLocalEulerAngles(154.2, 0, 180);
        if (GameConstant.DEBUG_CAMERA) {
            this.mainCamera.addComponent("script");
            this.mainCamera.script.create("orbitCamera", {
                attributes: {
                    inertiaFactor: 0.3, // Override default of 0 (no inertia)
                },
            });

            this.mainCamera.script.create("orbitCameraInputMouse");
            this.mainCamera.script.create("orbitCameraInputTouch");
            // this.player.controller.swipeMovement.disable();
            // this.player.controller.move.disable();
        } else {
            this._initCameraController();
        }
    }

    _initLight() {
        this.directionalLight = new pc.Entity("light-directional");
        this.addChild(this.directionalLight);

        this.directionalLight.addComponent("light", {
            type: LIGHTTYPE_DIRECTIONAL,
            color: new pc.Color(1, 1, 1),
            castShadows: true,
            shadowDistance: 100,
            shadowResolution: 500,
            shadowBias: 0.2,
            normalOffsetBias: 0.05,
            intensity: 1,
        });
        this.directionalLight.setLocalPosition(2, 30, -2);
        this.directionalLight.setLocalEulerAngles(45, 135, 0);
    }

    _initPlayer() {
        this.player = new Player(this.ran);
        this.addChild(this.player);
        //get player position from data
        let playerPos = DataManager.getLevelData().playerPos;
        this.player.setLocalPosition(playerPos.x, GameConstant.PLAYER_POS_Y, playerPos.z);
        this.swipeMovement = this.player.character.elements[0].addScript(SwipeMovement, {
            screenEntity: this.playScreen,
            multiplier: GameConstant.SWIPE_MULTIPLIER,
            speed: GameConstant.PLAYER_SPEED,
            range: GameConstant.PLAYER_LIMIT_X,
            // blockAreas: this.level.wallBlockAreas,
            // collider: this.player.collider,
        });
        this.player.controller = this.player.character.elements[0].addScript(PlayerController, {
            collider: this.player.character.collider,
            swipeMovement: this.swipeMovement,
            soliderSpawner: this.player.soliderSpawner,
            // blockAreas: this.level.roadBlockAreas,
            move: this.player.move,
        });
        this.inputHandler.on(InputHandlerEvent.PointerDown, this.swipeMovement.onPointerDown, this.swipeMovement);
        this.inputHandler.on(InputHandlerEvent.PointerMove, this.swipeMovement.onPointerMove, this.swipeMovement);
        this.inputHandler.on(InputHandlerEvent.PointerUp, this.swipeMovement.onPointerUp, this.swipeMovement);
        this.player.controller.on(PlayerEvent.Win, this._onPlayerWin, this);

    }
    _onPlayerWin() {
        this.cameraController.disable();
        this.gameManager.win();
    }
    _registerPlayScreenEvents() {
        this.playScreen.on(PlayScreenEvent.ButtonSettingClicked, this._openSetting, this);
    }

    _initfigure() {
        this.theFace = this.level.returnTheFace();
    }
    _initLevel() {

        this.currentLevel = DataManager.currentLevel
        let levelData = DataManager.getLevelData();
        // if(DataManager.currentLevel % 2 === 0){
        //     this.playScreen.loadingPlay.enabled = false
        //     this.playScreen.smileIcon.enabled = false
        //     this.playScreen.wowIcon.enabled = false
        //     this.playScreen.cryIcon.enabled = false
        // }
        this.level = new Level(this.ran);
        this.addChild(this.level);

        this.level.config(levelData);
        this.level.generate(levelData.levelData);
        this.level.configUpHill()

        this.registerLevelEvents();
        // this._initPlayer();

        this.level.controller = this.level.addScript(LevelController, {
            player: this.player,
        });
        this.playScreen.updateLevelText(DataManager.currentLevel);
        this.playScreen.updateCurrencyText(Math.ceil(UserData.currency));

        this.updateUserData();
        // this.player.controller.updateValue(UserData.startNumber);

    }
    disableSwipe() {
        this.swipeMovement.disable()
    }
    initPlayerEvent() {
        this.player.on(PlayerEvent.CameraZoomOut, () => {
            this.swipeMovement.disable()
            if (!this.cameraWhenEnd) {
                if (this.level.gamePlay === 1) {
                    this.cameraController.CameraUpAndGo();
                    this.cameraWhenEnd = true;
                }
                else {
                    this.cameraController.CameraUp();
                    this.cameraWhenEnd = true;
                }

            }
        });
        this.player.on("disableSwipe", () => {
            this.swipeMovement.disable()
        })
        this.player.on("upHill", () => {
            this.cameraController.cameraUpHill()
        })
        this.player.on(PlayerEvent.goToMan, () => {
            // if (!this.cameraWhenEnd) {
            //     this.cameraController.CameraUpAndGo();
            //     this.cameraWhenEnd = true;
            // }
        });
        this.player.on(PlayerEvent.Win, () => {
            this.theFace.eat();

            if (this.level.itemPoins.length / 2 > this.player.itemPoints) {
                Tween.createCountTween({
                    duration: 2,
                    onComplete: () => {
                        this.theFace.sad();
                        Tween.createCountTween({
                            duration: 2,
                            onComplete: () => {
                                let config = new AdVideoConfig();

                                config.onFinished = () => {

                                }
                                config.onError = (a) => {
                                    if (a.breakType !== "dismissed") {
                                    }
                                }
                                AdsManager.showVideo(AdVideoType.INTERSTITIAL, config);
                                this.ui.setScreenActive(GameConstant.SCREEN_LOSE);
                                this.theFace.mouth()
                                this.playScreen.loadingPlay.enabled = false
                                this.playScreen.smileIcon.enabled = false
                                this.playScreen.wowIcon.enabled = false
                                this.playScreen.cryIcon.enabled = false
                            }
                        }).start();
                    }
                }).start();
            }
            else {
                Tween.createCountTween({
                    duration: 2,
                    onComplete: () => {
                        this.theFace.smile();
                        Tween.createCountTween({
                            duration: 2,
                            onComplete: () => {

                                this.playScreen.loadingPlay.enabled = false
                                this.playScreen.smileIcon.enabled = false
                                this.playScreen.wowIcon.enabled = false
                                this.playScreen.cryIcon.enabled = false

                                this.ui.setScreenActive(GameConstant.SCREEN_WIN);
                                this.winScreen._initConfetti()

                                let config = new AdVideoConfig();
                                // config.onStarted = () => {
                                // this.btnMoreSpin.enabled = false;
                                // }
                                config.onFinished = () => {
                                    // this.btnMoreSpin.enabled = true;
                                    // this._onTapBtnStartSpin();
                                }
                                config.onError = (a) => {
                                    if (a.breakType !== "dismissed") {
                                    }
                                    // this.btnMoreSpin.enabled = true;
                                }
                                AdsManager.showVideo(AdVideoType.INTERSTITIAL, config);
                                this.winScreen.play()

                            }
                        }).start();
                    }
                }).start();

            }


        });

        this.player.on(PlayerEvent.checkWinLose1, (z, x, thisman) => {
            this.level.mans.forEach((man) => {
                if (x > 0) {
                    if (man.getPosition().z < z)
                        man.eat();
                    else
                        man.sad()
                }
                else {
                    if (man.getPosition().z < z + 2)
                        man.eat();
                    else
                        man.sad()
                }

            })
            if (this.level.mans.length / 2 < this.player.anotherB.length) {
                Tween.createCountTween({
                    duration: 3,
                    onComplete: () => {
                        this.playScreen.loadingPlay.enabled = false
                        this.playScreen.smileIcon.enabled = false
                        this.playScreen.wowIcon.enabled = false
                        this.playScreen.cryIcon.enabled = false

                        this.ui.setScreenActive(GameConstant.SCREEN_WIN);
                        let config = new AdVideoConfig();
                        // config.onStarted = () => {
                        // this.btnMoreSpin.enabled = false;
                        // }
                        config.onFinished = () => {
                            // this.btnMoreSpin.enabled = true;
                            // this._onTapBtnStartSpin();
                        }
                        config.onError = () => {
                            //this.showPopup()
                            if (a.breakType !== "dismissed") {
                            }
                            // this.btnMoreSpin.enabled = true;
                        }
                        AdsManager.showVideo(AdVideoType.INTERSTITIAL, config);
                        this.winScreen.play()
                    }
                }).start();
            }
            else {
                Tween.createCountTween({
                    duration: 3,
                    onComplete: () => {
                        this.playScreen.loadingPlay.enabled = false
                        this.playScreen.smileIcon.enabled = false
                        this.playScreen.wowIcon.enabled = false
                        this.playScreen.cryIcon.enabled = false
                        let config = new AdVideoConfig();
                        // config.onStarted = () => {
                        // this.btnMoreSpin.enabled = false;
                        // }
                        config.onFinished = () => {
                            // this.btnMoreSpin.enabled = true;
                            // this._onTapBtnStartSpin();
                        }
                        config.onError = (a) => {

                            if (a.breakType !== "dismissed") {
                            }
                            // this.btnMoreSpin.enabled = true;
                        }
                        AdsManager.showVideo(AdVideoType.INTERSTITIAL, config);
                        this.ui.setScreenActive(GameConstant.SCREEN_LOSE);
                        // this.loseScreen.play()
                    }
                }).start();
            }

        });
    }
    showPopup() {
        if (!this.popupScreen) {
            this.popupScreen = new PopupScreen();
            this.addChild(this.popupScreen);
        }
        this.popupScreen.showPopup();
        Tween.createCountTween({
            duration: 2,
            onComplete: () => {
                this.popupScreen.closePopup()
            }

        })
    }
    loseGame() {
        Tween.createCountTween({
            duration: 3,
            onComplete: () => {
                let config = new AdVideoConfig();

                config.onFinished = () => {

                }
                config.onError = (a) => {
                    if (a.breakType !== "dismissed") {
                    }
                }
                AdsManager.showVideo(AdVideoType.INTERSTITIAL, config);
                this.ui.setScreenActive(GameConstant.SCREEN_LOSE);
                // this.loseScreen.play()
            }
        }).start();
    }
    registerLevelEvents() {

        this.player.on(PlayerEvent.Bumpy, () => {
            this.mainCamera.fire(cameraEvent.bumpy);
        });
        this.player.on(PlayerEvent.Losep, () => {
            // alert("die");
        });


        this.level.redDamages.forEach(redDmg => {
            redDmg.off(RedDamageControllerEvent.Hit, this._onRedDamageDestroy, this);
            redDmg.once(RedDamageControllerEvent.Hit, this._onRedDamageDestroy, this);
        })
        this.level.walls.forEach(wall => {
            wall.on(EndWallEvent.Break, () => {
                this.sfxWallBreak.play();
            });
        });
        if (this.level.bigBoss) {
            this.level.bigBoss.on(BigBossEvent.Break, () => {
                this.sfxWallImpact.play();
            });
        }
    }
    updateUserData() {
        let startNumber = UserData.startNumber;
        let money = GameConstant.PLAYER_START_UPGRADE_NUMBER_MONEY * (startNumber - GameConstant.PLAYER_START_UPGRADE_NUMBER_STEP);
        // this.tutorialScreen.updateStartNumberText(startNumber, money);

        let startIncome = UserData.income;
        let nextIncome = startIncome + GameConstant.PLAYER_START_UPGRADE_INCOME_STEP;
        let incomeMoney = GameConstant.PLAYER_START_UPGRADE_INCOME_MONEY * ((nextIncome - GameConstant.PLAYER_START_INCOME) * 10);
        // this.tutorialScreen.updateIncomeText(startIncome, incomeMoney);
    }





}
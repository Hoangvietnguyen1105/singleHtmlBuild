import { ELEMENTTYPE_IMAGE, Entity, Vec2, Vec3, Vec4, math } from "playcanvas";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { Util } from "../../../helpers/util";
import { Time } from "../../../template/systems/time/time";
import { DataLocal, DataLocalState } from "../../data/dataLocal";
import { ObjectFactory } from "../../../template/objects/objectFactory";
import { Tween } from "../../../template/systems/tween/tween";
//import { AdState, AdsManager } from "../../ads/adsManager";


export class LoadingPlay extends Entity {
    constructor(data) {
        super("loadingPlay");
        this.addComponent("element", {
            type: ELEMENTTYPE_IMAGE,
            spriteAsset: AssetLoader.getAssetByKey("bar-bg"),
            anchor: new Vec4(0.1, 0.7, 0.1, 0.7),
            pivot: new Vec2(0.5, 0.5),
            width: 40,
            height: 316
        });
        this._initBar()
        this.increase = 0
        this.on('increase', this.setProgress)
        this.originalColor = Util.createColor(251, 130, 0); // Màu gốc của barPlay
        this.endColor = Util.createColor(245, 27, 27)
        this.color = 'orange'
    }

    _initBar() {
        this.barPlay = new Entity("bar");
        this.barPlay.addComponent("element", {
            type: ELEMENTTYPE_IMAGE,
            spriteAsset: AssetLoader.getAssetByKey("bar-bg"),
            anchor: new Vec4(0, 0, 1, 0),
            pivot: new Vec2(0, 0.5),
            margin: new Vec4(5, 5, 5, 5),
            color: Util.createColor(251, 130, 0),
        });
        this.progressImageMaxWidth = this.element.width - 10;

        this.addChild(this.barPlay);

    }

    setProgress(progress) {
        let curve = new pc.Curve([
            0, this.increase,
            1, this.increase += progress
        ])

        Tween.createCountTween({
            duration: 0.5,
            onUpdate: (dt) => {
                let data = curve.value(dt.percent)
                this.barPlay.element.anchor = new pc.Vec4(0, 0, 1, data)
            },
            onComplete: (dt) => {
                if (this.increase >= 0.5 && this.increase < 1 && !this.checkScaleSmile) {
                    let curve2 = new pc.Curve([
                        0, 64,
                        0.5, 128,
                        1, 64
                    ])
                    this.checkScaleSmile = true

                    Tween.createCountTween({
                        duration: 0.5,
                        onUpdate: (dt) => {
                            let data = curve2.value(dt.percent)
                            this.parent.smileIcon.element.width = data
                            this.parent.smileIcon.element.height = data
                        },

                    }).start()
                }
                if (this.increase >= 0.96 && !this.checkScaleWow) {
                    let curve2 = new pc.Curve([
                        0, 64,
                        0.5, 128,
                        1, 64
                    ])
                    this.checkScaleWow = true

                    Tween.createCountTween({
                        duration: 0.5,
                        onUpdate: (dt) => {
                            let data = curve2.value(dt.percent)
                            this.parent.wowIcon.element.width = data
                            this.parent.wowIcon.element.height = data
                        },

                    }).start()
                }
            }
        }).start();

    }


    lerpColor(startColor, endColor, t) {
        let lerpedColor = new pc.Color();
        lerpedColor.lerp(startColor, endColor, t);
        return lerpedColor;
    }

    update() {
        if (this.color != 'red') {
            let t = 0.05;
            let lerpedColor = this.lerpColor(this.barPlay.element.color, this.endColor, t); // Màu đỏ
            this.barPlay.element.color = lerpedColor;

            if (Math.round(lerpedColor.r * 255) === this.endColor.r * 255) {
                this.color = 'red'
            }

        } else {
            // Lerp ngược lại
            let t = 0.05;
            let lerpedColor = this.lerpColor(this.barPlay.element.color, this.originalColor, t); // Màu gốc
            this.barPlay.element.color = lerpedColor;
            if (Math.round(lerpedColor.r * 255) === this.originalColor.r * 255) {
                this.color = 'orange'
            }

        }
    }

    start() {
        this.started = true;
    }
    reset() {
        this.increase = 0
        this.barPlay.element.anchor = new pc.Vec4(0, 0, 1, 0)

    }
} 
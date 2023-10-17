import { AssetListLoader, Curve, CurveSet, EMITTERSHAPE_BOX, Entity } from "playcanvas";
import { AssetLoader } from "../../../assetLoader/assetLoader";


export class DieEffect extends Entity {
    constructor() {
        super();
        this._initParticle();
    }

    _initParticle() {
        this.dieFx = new Entity();
        this.addChild(this.dieFx);
        this.dieFx.setLocalPosition(6.5, 5, 6.5)
        let texture = AssetLoader.getAssetByKey("roadTex").resource;

        let scaleGraph = new Curve([0, 1, 1, 0]);
        let rotationSpeedGraph = new Curve([0, 1, 1, -180]);
        let alphaGraph = new Curve([
            [0, 0.619, 0.686, 0.65, 1, 0.194],
            [0, 1, 0.691, 0.825, 1, 0]
        ]);


        let colorGraph = new CurveSet([
            [0, 217 / 255, 0.5, 253 / 255, 1, 242 / 255],
            [0, 172 / 255, 0.5, 238 / 255, 1, 242 / 255],
            [0, 172 / 255, 0.5, 0 / 255, 1, 50],
        ]);

        this.dieFx.addComponent("particlesystem", {
            autoPlay: true,
            loop: true,
            lifetime: 0.8,
            numParticles: 10,
            rate: 0,
            rate2: 0.1,
            emitterShape: EMITTERSHAPE_BOX,
            startAngle: 1,
            startAngle2: 360,
            lighting: false,
            intensity: 1,
            colorMap: texture,
            localSpace: true,
            rotationSpeedGraph,
            scaleGraph,
            colorGraph,
        });
    }

    play() {
        this.dieFx.particlesystem.reset();
        this.dieFx.particlesystem.play();
    }
}

import { Curve, CurveSet, EMITTERSHAPE_SPHERE, Entity } from "playcanvas";
import { AssetLoader } from "../../../assetLoader/assetLoader";

export class flame extends Entity {
    constructor() {
        super();

        this.flame = new Entity();
        this.flame.setLocalScale(3, 3.5, 3)
        this.flame.setLocalEulerAngles(-30, -90, 0)
        this.addChild(this.flame);
        // this.flame.setLocalPosition(0, 5, -6)
        let localVelocityGraph = new CurveSet([
            [0, 5],
            [0, 5],
            [0, 5]
        ]);

        let velocity = 2;

        let velocityGraph = new CurveSet([
            [0, 0],
            [0, 0],
            [0, 0]
        ]);

        let radialSpeedGraph = new pc.Curve([
            0, 5, 0, -5
        ])

        let velocityGraph2 = new CurveSet([
            [0, velocity, 1, velocity],
            [0, velocity, 1, velocity],
            [0, velocity, 1, velocity]
        ]);

        let scaleGraph = new Curve([0, 0.2, 1, 1]);
        let colorGraph = new CurveSet([
            [0, 192 / 255],
            [0, 96 / 255],
            [0, 0 / 255]
        ]);

        let alphaGraph = new Curve([0, 0.75, 1, 0, 4])

        let texture = AssetLoader.getAssetByKey("tex_dot_glow").resource;
        this.flame.addComponent("particlesystem", {
            loop: true,
            autoPlay: true,
            numParticles: 50,
            lifetime: 0.5,
            rate: 0.5,
            rate2: 0,
            startAngle: 0,
            startAngle2: 0,
            blendType: pc.BLEND_ADDITIVE,
            emitterShape: EMITTERSHAPE_SPHERE,
            emitterRadius: 0,
            emitterRadiusInner: 0,
            localVelocityGraph,
            velocityGraph,
            velocityGraph2: velocityGraph,
            scaleGraph,
            colorGraph,
            radialSpeedGraph,
            alphaGraph
        });
    }

    play() {
        this.flame.particlesystem.reset();
        this.flame.particlesystem.play();
    }
}
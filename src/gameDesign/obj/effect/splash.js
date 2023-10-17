import { Curve, CurveSet, EMITTERSHAPE_SPHERE, Entity } from "playcanvas";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { Tween } from "../../../template/systems/tween/tween";
import { SpawningEvent } from "../../script/spawners/spawningEvent";

export class SplashFx extends Entity {
  constructor() {
    super();

    this.splash = new Entity();
    this.splash.setLocalScale(2, 2, 2)
    this.addChild(this.splash);
    // this.splash.setLocalPosition(0, 5, -6)
    let localVelocityGraph = new CurveSet([
      [0, 0, 1, 0],
      [0, 0, 0.56, 0, 1, -10],
      [0, 0, 1, 0]
    ]);

    let velocity = 2;

    let velocityGraph = new CurveSet([
      [0, -velocity, 1, -velocity],
      [0, -velocity, 1, -velocity],
      [0, -velocity, 1, -velocity]
    ]);

    let velocityGraph2 = new CurveSet([
      [0, velocity, 1, velocity],
      [0, velocity, 1, velocity],
      [0, velocity, 1, velocity]
    ]);

    let scaleGraph = new Curve([0, 0.2, 1, 0]);
    let colorGraph = new CurveSet([
      [0, 247 / 255],
      [0, 237 / 255],
      [0, 237 / 255]
    ]);

    let texture = AssetLoader.getAssetByKey("tex_dot_glow").resource;
    this.splash.addComponent("particlesystem", {
      loop: false,
      autoPlay: true,
      numParticles: 50,
      lifetime: 0.5,
      rate: 0,
      emitterShape: EMITTERSHAPE_SPHERE,
      emitterRadiusInner: 5,
      colorMap: texture,
      localVelocityGraph,
      velocityGraph,
      velocityGraph2,
      scaleGraph,
      colorGraph
    });
  }

  play() {
    this.splash.particlesystem.reset();
    this.splash.particlesystem.play();
    setTimeout(() => {
      this.fire(SpawningEvent.Despawn);
    }, 1000);
  }
}
import { CollisionDetector } from "./collisionDetector";
import { CollisionTag } from "./collisionTag";

export class Physics {
  /**
   * @param {pc.Application} app
   */

  static init(app) {
    CollisionDetector.instance.init([
      {
        tag: CollisionTag.Player,
        collideTags: [
          CollisionTag.Jump, CollisionTag.item, CollisionTag.item_lose, CollisionTag.upHillRoad,
          CollisionTag.downHillRoad, CollisionTag.bumpyRoad, CollisionTag.endRoad, CollisionTag.hand_left, CollisionTag.itemBurger,
          CollisionTag.man, CollisionTag.endRoad2, CollisionTag.table, CollisionTag.endRoad1, CollisionTag.fork, CollisionTag.hammer, CollisionTag.UpHillLowRoad, CollisionTag.knife,
          CollisionTag.Door, CollisionTag.curvedDown, CollisionTag.curvedUp, CollisionTag.hob, CollisionTag.RollingDough
        ],
      },
      {
        tag: CollisionTag.SoliderPlayer,
        collideTags: [CollisionTag.SoliderEnemy],
      },
    ]);

    app.on("update", this.update, this);
  }

  static update() {
    CollisionDetector.instance.update();
  }

  static reset() {
    CollisionDetector.instance.reset();
  }
}

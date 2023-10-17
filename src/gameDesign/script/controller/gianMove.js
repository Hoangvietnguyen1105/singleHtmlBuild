
import { Script } from "../../../template/systems/script/script"
import { Vec3, math } from "playcanvas";

import { Time } from "../../../template/systems/time/time";
export const gianMove = Script.createScript({
    name: "gianMove",
    attributes: {
        gian: { default: null },
    },
    initialize() {
        this._tmpPosition = this.entity.getLocalPosition();
    },
    update(dt) {
        this.entity.setLocalPosition(this._tmpPosition.x + 3 * dt, this._tmpPosition.y, this._tmpPosition.z)
        if (this._tmpPosition.x >= 4.9) {
            this.entity.setLocalPosition(-5, this._tmpPosition.y, this._tmpPosition.z)
        }

    }









})

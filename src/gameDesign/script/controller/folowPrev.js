
import { Script } from "../../../template/systems/script/script"
import { Vec3, math } from "playcanvas";

import { Time } from "../../../template/systems/time/time";
export const folowPrev = Script.createScript({
    name: "folowPrev",
    attributes: {
        prevCharacter: { default: null },
    },
    initialize() {
        this._tmpPosition = this.entity.getLocalPosition();
    },
    update(dt) {
        
        var targetPosition = this.prevCharacter.getLocalPosition();
        var lerpFactor = 0.75 ; // Hệ số lerppf
        // Chỉ lấy giá trị trục x từ vị trí hiện tại và vị trí mục tiêu
        var currentX = this._tmpPosition.x;
        var targetX = targetPosition.x;
        var currentZ = this._tmpPosition.z;
        var targetZ = targetPosition.z;
        // Sử dụng hàm lerp chỉ cho trục x và z để dịch chuyển từ currentX đến targetX
        var lerpedX = pc.math.lerp(currentX, targetX, lerpFactor );
        var lerpedZ = pc.math.lerp(currentZ, targetZ, lerpFactor);

        // Gán lại giá trị x vào _tmpPosition và giữ nguyên y và z
        this._tmpPosition.set(lerpedX, this._tmpPosition.y, lerpedZ);
        this.entity.setLocalPosition(this._tmpPosition);



    }









})

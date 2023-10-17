
export class physics_ammo {
    static setPhysics(obj, type) {
        obj.addComponent("collision", {
            type: "box",
            halfExtents: new pc.Vec3(obj.getLocalScale().x / 2, obj.getLocalScale().y / 2, obj.getLocalScale().z / 2), // Kích thước của vùng va chạm thu nhỏ
        });
        obj.addComponent("rigidbody", {
            type: type,
            mass: 50,
            restitution: 0.5,
            friction: 0.5,
        });
    }
}
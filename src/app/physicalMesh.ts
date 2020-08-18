import { Mesh, Vector3 } from "three";

export class PhysicalMesh extends Mesh {
    public size: Vector3
    public initPosition: CANNON.Vec3
    public body: CANNON.Body

    constructor() {
        super()
    }
}
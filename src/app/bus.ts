import { BoxGeometry, Color, Mesh, MeshBasicMaterial } from 'three';

export class Bus extends Mesh {


  constructor(sizeX: number,sizeY: number,sizeZ: number, color: Color) {
    super();
    this.geometry = new BoxGeometry(sizeX, sizeY, sizeZ);
    this.material = new MeshBasicMaterial({ color });
  }
}
